<script lang="ts">
    import {getRandomHSVColor} from "../util/colors";

    let isDrawing: boolean = false;
    let startX: number = 0;
    let startY: number = 0;
    let pathData: string = '';
    let currentPath: SVGPathElement | undefined = undefined;


    let last_time: number = Date.now();
    function handleMouseDown(event: PointerEvent) {
        //console.log(event.pointerId + ": down")
        isDrawing = true
        startX = event.clientX
        startY = event.clientY

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


    function handleMouseMove(event: PointerEvent) {
        //console.log(event.pointerId + ": move")
        if (!isDrawing) return
        if (!(currentPath instanceof SVGPathElement)) return
        if (Date.now() - last_time < 1000 / 30) return
        last_time = Date.now()

        const currentX = event.clientX | 0
        const currentY = event.clientY | 0
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
        touch-action: none;
    }
</style>