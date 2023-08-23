import { html, css, LitElement } from 'lit';
// @ts-ignore
import { property } from 'lit/decorators.js';

export class Desk extends LitElement {

    declare scale: number
    declare translateX: number
    declare translateY: number

    static override properties = {
        scale: { type: Number },
        translateX: { type: Number },
        translateY: { type: Number },
    }

    declare svg: SVGSVGElement

    constructor() {
        super();
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
    }

    static override styles = css`
        div {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
        }
    `;

    handleTransform() {
        if (!this.svg) {
            console.warn("No SVG element found in the first child of the slot element")
            return
        }
        this.svg.setAttribute('transform', `translate(${this.translateX}, ${this.translateY}) scale(${this.scale})`)
    }

    handleZoom(event: WheelEvent) {
        console.log("zooming");
        // Make it exponential so that it never goes under 0
        this.scale *= Math.pow(1.1, event.deltaY / 100);
        this.handleTransform()
        console.log(this.scale);
        console.log(event.deltaY);
    }

    mouse_start: [number | undefined, number | undefined] = [undefined, undefined];
    handlePan(event: MouseEvent) {
        if (event.type === 'mousedown') {
                this.mouse_start = [event.clientX, event.clientY];
        } else if (event.type === 'mousemove') {
                if (this.mouse_start[0] !== undefined && this.mouse_start[1] !== undefined) {
                        this.translateX += event.clientX - this.mouse_start[0];
                        this.translateY += event.clientY - this.mouse_start[1];
                        this.mouse_start = [event.clientX, event.clientY];
                }
        } else if (event.type === 'mouseup') {
                this.mouse_start = [undefined, undefined];
        }
        this.handleTransform();
    }

    override connectedCallback() {
        super.connectedCallback();
        this.addEventListener('wheel', this.handleZoom);
        this.addEventListener('mousedown', this.handlePan);
        this.addEventListener('mousemove', this.handlePan);
        this.addEventListener('mouseup', this.handlePan);
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('wheel', this.handleZoom);
        this.removeEventListener('mousedown', this.handlePan);
        this.removeEventListener('mousemove', this.handlePan);
        this.removeEventListener('mouseup', this.handlePan);
    }

    waitUntilNotNull() {
        return new Promise((resolve) => {
            const slotElement = this.shadowRoot!.querySelector('slot') as HTMLSlotElement;
            if ((slotElement.assignedElements()[0] as HTMLElement).firstElementChild !== null) {
                resolve(true);
            } else {
                const interval = setInterval(() => {
                    if ((slotElement.assignedElements()[0] as HTMLElement).firstElementChild !== null) {
                        clearInterval(interval);
                        resolve(true);
                    }
                }, 100);
            }
        });
    }

    override async firstUpdated() {
        const slotElement = this.shadowRoot!.querySelector('slot') as HTMLSlotElement;
        console.log(slotElement);
        await this.waitUntilNotNull();
        this.svg = (slotElement.assignedElements()[0] as HTMLElement).firstElementChild as SVGSVGElement;
        console.log(this.svg);
        if (!this.svg) {
            console.error("No SVG element found in the first child of the slot element")
            console.log(slotElement)
            console.log(slotElement.assignedElements())
            console.log((slotElement.assignedElements()[0] as HTMLElement).firstElementChild)
        }
    }

    override render() {
        return html`
            <div>
                <slot></slot>
            </div>
        `;
    }
}
customElements.define('desk-', Desk);