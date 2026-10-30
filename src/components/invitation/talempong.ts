/**
 * Musik latar tema Minang: melodi pentatonik bergaya talempong yang dibangkitkan langsung
 * dengan Web Audio, jadi tidak ada berkas musik berhak cipta yang perlu dilisensikan.
 */
const NOTES = [392, 440, 523.25, 587.33, 659.25, 783.99];
// Indeks nada per ketukan; null berarti diam.
const PATTERN: (number | null)[] = [0, null, 2, 3, 4, null, 3, 2, 1, null, 3, null, 2, 1, 0, null, 2, null, 4, 5, 4, null, 3, 2, 3, null, 1, 2, 0, null, null, null];
const STEP_SECONDS = 0.3;
const LOOK_AHEAD = 0.6;
const VOLUME = 0.09;

export class Talempong {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private step = 0;
  private nextTime = 0;

  start() {
    if (this.timer) return;
    this.ctx ??= new AudioContext();
    void this.ctx.resume();
    if (!this.master) {
      this.master = this.ctx.createGain();
      this.master.connect(this.ctx.destination);
    }
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.setTargetAtTime(VOLUME, this.ctx.currentTime, 0.4);
    this.nextTime = this.ctx.currentTime + 0.1;
    this.timer = setInterval(() => this.schedule(), 150);
    this.schedule();
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    if (this.ctx && this.master) this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
  }

  dispose() {
    this.stop();
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
  }

  private schedule() {
    if (!this.ctx) return;
    while (this.nextTime < this.ctx.currentTime + LOOK_AHEAD) {
      const note = PATTERN[this.step % PATTERN.length];
      if (note !== null) this.strike(NOTES[note], this.nextTime);
      this.step++;
      this.nextTime += STEP_SECONDS;
    }
  }

  /** Bunyi logam: nada dasar ditambah harmonik yang lebih cepat hilang. */
  private strike(freq: number, at: number) {
    if (!this.ctx || !this.master) return;
    for (const [ratio, level, decay] of [
      [1, 1, 1.5],
      [2.76, 0.28, 0.5],
      [5.4, 0.08, 0.2],
    ]) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq * ratio;
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(level, at + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0008, at + decay);
      osc.connect(gain).connect(this.master);
      osc.start(at);
      osc.stop(at + decay + 0.05);
    }
  }
}
