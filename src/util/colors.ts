export function getRandomHSVColor(): string {
    let hue = Math.floor(Math.random() * 361); // Random hue between 0 and 360

    return `hsl(${hue}, 100%, 50%)`;
}