let sharedContext: AudioContext | null = null

export async function playSceneTone(
  enabled: boolean,
  frequencies: number[],
  duration: number,
  wave: OscillatorType,
) {
  if (!enabled || typeof window === 'undefined') {
    return
  }

  const context =
    sharedContext ??
    new window.AudioContext({ latencyHint: 'interactive' })

  sharedContext = context

  await context.resume()

  const startTime = context.currentTime + 0.02

  frequencies.forEach((frequency, index) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const offset = index * 0.04

    oscillator.type = wave
    oscillator.frequency.setValueAtTime(frequency, startTime + offset)

    gain.gain.setValueAtTime(0.0001, startTime + offset)
    gain.gain.exponentialRampToValueAtTime(0.12, startTime + offset + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + offset + duration)

    oscillator.connect(gain)
    gain.connect(context.destination)

    oscillator.start(startTime + offset)
    oscillator.stop(startTime + offset + duration + 0.04)
  })
}