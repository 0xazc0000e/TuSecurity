/**
 * Simple Synthesizer for Retro Cyber Sounds
 * Uses Web Audio API to generate sounds without external files.
 */

class SoundEffects {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
    }

    play(type) {
        if (!this.enabled || !this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        switch (type) {
            case 'typing':
                this.playTone(800, 'square', 0.03, 0.05);
                break;
            case 'command_success':
                this.playSequence([
                    { freq: 440, type: 'sine', duration: 0.1 },
                    { freq: 880, type: 'sine', duration: 0.2 }
                ]);
                break;
            case 'command_error':
                this.playTone(150, 'sawtooth', 0.3, 0.3);
                break;
            case 'task_complete':
                this.playSequence([
                    { freq: 523.25, type: 'triangle', duration: 0.1 }, // C5
                    { freq: 659.25, type: 'triangle', duration: 0.1 }, // E5
                    { freq: 783.99, type: 'triangle', duration: 0.1 }, // G5
                    { freq: 1046.50, type: 'triangle', duration: 0.3 } // C6
                ]);
                break;
            case 'phase_complete':
                // Victory fanfare (simple)
                this.playSequence([
                    { freq: 523.25, type: 'square', duration: 0.15 },
                    { freq: 523.25, type: 'square', duration: 0.15 },
                    { freq: 523.25, type: 'square', duration: 0.15 },
                    { freq: 659.25, type: 'square', duration: 0.4 }
                ]);
                break;
            case 'nav':
                this.playTone(300, 'sine', 0.05, 0.05);
                break;
            default:
                break;
        }
    }

    playTone(freq, type, duration, vol = 0.1) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playSequence(notes) {
        let startTime = this.ctx.currentTime;
        notes.forEach(note => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = note.type || 'sine';
            osc.frequency.setValueAtTime(note.freq, startTime);

            gain.gain.setValueAtTime(0.1, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + note.duration);

            startTime += note.duration;
        });
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// Singleton instance
export const sfx = new SoundEffects();
export default sfx;
