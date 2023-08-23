<script lang="ts">
    import {getRandomHSVColor} from "../util/colors";

    let isDrawing: boolean = false;
    let startX: number = 0;
    let startY: number = 0;
    let pathData: string = '';
    let currentPath: SVGPathElement | undefined = undefined;
    let defaultWidth: number = 500; // ! don't use this for size, only for scale


    let last_time: number = Date.now();
    function handleMouseDown(this: SVGElement, event: PointerEvent) {
        //console.log(event.pointerId + ": down")
        isDrawing = true
        let x = this.getBoundingClientRect().left
        let y = this.getBoundingClientRect().top
        let scale = this.getBoundingClientRect().width / defaultWidth
        startX = (event.clientX - x) / scale
        startY = (event.clientY - y) / scale

        // Create a new path element and append it to the SVG element
        const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        newPath.setAttribute('stroke', getRandomHSVColor())
        newPath.setAttribute('stroke-width', '2')
        newPath.setAttribute('fill', 'none')
        document.querySelector('svg')!.appendChild(newPath)

        // Set the current path element to the new path element
        currentPath = newPath
        last_time = Date.now()
        event.preventDefault()
    }


    function handleMouseMove(this: SVGElement, event: PointerEvent) {
        //console.log(event.pointerId + ": move")
        if (!isDrawing) return
        if (!(currentPath instanceof SVGPathElement)) return
        if (Date.now() - last_time < 1000 / 30) return
        last_time = Date.now()

        let x = this.getBoundingClientRect().left
        let y = this.getBoundingClientRect().top
        let scale = this.getBoundingClientRect().width / defaultWidth
        // event.clientX / scale ->
        const currentX = (event.clientX - x) / scale
        const currentY = (event.clientY - y) / scale
        // Update the path data
        pathData += `M ${startX} ${startY} L ${currentX} ${currentY}`
        startX = currentX
        startY = currentY
        // Update the current path element
        currentPath.setAttribute('d', pathData)
        event.preventDefault()
    }

    function handleMouseUp(event: PointerEvent) {
        //console.log(event.pointerId + ": up")
        isDrawing = false
        currentPath = undefined
        pathData = ''
        event.preventDefault()
    }

    function handleMouseLeave(event: PointerEvent) {
        //console.log(event.pointerId + ": leave")
        isDrawing = false
        currentPath = undefined
        pathData = ''
        event.preventDefault()
    }

    // If touch and stylus only work for a short time, try uncommenting this (Note: I have no idea why this works sometimes):
    //window.addEventListener('mousemove', function(event) {
    //    var mouseX = event.clientX;
    //    var mouseY = event.clientY;

    //    console.log('Mouse position: ' + mouseX + ', ' + mouseY);
    //});
</script>

<svg
    width="500"
    height="500"
    xmlns="http://www.w3.org/2000/svg"
    on:pointerdown={handleMouseDown}
    on:pointermove={handleMouseMove}
    on:pointerup={handleMouseUp}
    on:pointerleave={handleMouseLeave}
/>

<style>
    svg {
        border: 1px solid black;
        background: white;
    }
    * {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
</style>