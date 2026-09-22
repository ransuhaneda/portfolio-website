import { useRef } from 'react'
import { gsap, ScrollTrigger, SplitText, useGSAP } from './gsap'

type TextRevealGroup = HTMLElement & {
  dataset: DOMStringMap & {
    textRevealGroup?: 'entry' | 'scrub'
  }
}

type StaggerOrigin = 'start' | 'center' | 'end'

type MotionProfile = {
  headingDuration: number
  headingStagger: number
  headingEase: string
  headingFrom: StaggerOrigin
  copyDuration: number
  copyStagger: number
  copyEase: string
  copyFrom: StaggerOrigin
  copyDelay: number
  copyY: number
  start: string
}

const textRevealSelector = '[data-text-reveal="heading"], [data-text-reveal="copy"]'

const entryProfile: MotionProfile = {
  headingDuration: 0.88,
  headingStagger: 0.09,
  headingEase: 'expo.out',
  headingFrom: 'start',
  copyDuration: 0.72,
  copyStagger: 0.08,
  copyEase: 'power3.out',
  copyFrom: 'start',
  copyDelay: 0.18,
  copyY: 20,
  start: 'top 90%',
}

const scrollProfiles: MotionProfile[] = [
  {
    headingDuration: 0.72,
    headingStagger: 0.08,
    headingEase: 'expo.out',
    headingFrom: 'start',
    copyDuration: 0.7,
    copyStagger: 0.055,
    copyEase: 'power3.out',
    copyFrom: 'start',
    copyDelay: 0.14,
    copyY: 18,
    start: 'top 82%',
  },
  {
    headingDuration: 0.84,
    headingStagger: 0.115,
    headingEase: 'power2.out',
    headingFrom: 'center',
    copyDuration: 0.9,
    copyStagger: 0.09,
    copyEase: 'circ.out',
    copyFrom: 'center',
    copyDelay: 0.24,
    copyY: 28,
    start: 'top 76%',
  },
  {
    headingDuration: 0.62,
    headingStagger: 0.06,
    headingEase: 'power4.out',
    headingFrom: 'end',
    copyDuration: 0.66,
    copyStagger: 0.045,
    copyEase: 'expo.out',
    copyFrom: 'end',
    copyDelay: 0.1,
    copyY: 16,
    start: 'top 86%',
  },
]

let refreshFrame: number | undefined

function scheduleScrollTriggerRefresh() {
  if (refreshFrame !== undefined) return

  refreshFrame = requestAnimationFrame(() => {
    refreshFrame = undefined
    ScrollTrigger.refresh()
  })
}

function profileFor(group: TextRevealGroup, index: number) {
  return group.dataset.textRevealGroup === 'entry'
    ? entryProfile
    : scrollProfiles[index % scrollProfiles.length]
}

function createGroupTimeline(
  group: TextRevealGroup,
  index: number,
  withScrollTrigger: boolean,
  delay = 0,
) {
  const profile = profileFor(group, index)
  const targets = Array.from(group.querySelectorAll<HTMLElement>(textRevealSelector))
  const heading = targets.find((target) => target.dataset.textReveal === 'heading')
  const copyTargets = targets.filter((target) => target.dataset.textReveal === 'copy')

  if (!heading && !copyTargets.length) return

  const timelineOptions = {
    delay,
    scrollTrigger: withScrollTrigger ? {
      trigger: group,
      start: profile.start,
      toggleActions: 'play none none reverse',
      invalidateOnRefresh: true,
    } : undefined,
  }

  if (!heading) {
    gsap.timeline(timelineOptions).from(copyTargets, {
      duration: profile.copyDuration,
      y: profile.copyY,
      autoAlpha: 0,
      stagger: { each: profile.copyStagger, from: profile.copyFrom },
      ease: profile.copyEase,
    })
    return
  }

  // SplitText applies the line masks synchronously after this parent is
  // visible, so the unsplit heading cannot flash before its line reveal.
  gsap.set(heading, { opacity: 1 })
  SplitText.create(heading, {
    type: 'words,lines',
    linesClass: 'text-reveal-line',
    autoSplit: true,
    mask: 'lines',
    aria: 'auto',
    onSplit: (self) => {
      const timeline = gsap.timeline(timelineOptions)

      timeline.from(self.lines, {
        duration: profile.headingDuration,
        yPercent: 100,
        opacity: 0,
        stagger: { each: profile.headingStagger, from: profile.headingFrom },
        ease: profile.headingEase,
      }, 0)

      if (copyTargets.length) {
        timeline.from(copyTargets, {
          duration: profile.copyDuration,
          y: profile.copyY,
          autoAlpha: 0,
          stagger: { each: profile.copyStagger, from: profile.copyFrom },
          ease: profile.copyEase,
        }, `<${profile.copyDelay}`)
      }

      scheduleScrollTriggerRefresh()
      return timeline
    },
  })
}

export function useScrollTextAnimations(routeKey: string) {
  const scope = useRef<HTMLElement>(null)

  useGSAP(() => {
    const root = scope.current
    if (!root) return

    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const groups = Array.from(root.querySelectorAll<TextRevealGroup>('[data-text-reveal-group]'))
      const entryGroups = groups.filter((group) => group.dataset.textRevealGroup === 'entry')
      const scrollGroups = groups.filter((group) => group.dataset.textRevealGroup !== 'entry')

      // The first viewport gets a deliberately paced entrance rather than a
      // collection of independent tweens that all begin on the same frame.
      entryGroups.forEach((group, index) => {
        createGroupTimeline(group, index, false, 0.08 + index * 0.14)
      })

      // Below the fold, each section owns its ScrollTrigger and uses a
      // different motion profile so the page develops a visual rhythm.
      scrollGroups.forEach((group, index) => {
        createGroupTimeline(group, index, true)
      })
    })

    return () => media.revert()
  }, {
    scope,
    dependencies: [routeKey],
    revertOnUpdate: true,
  })

  return scope
}