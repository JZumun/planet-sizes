import { create as rand } from "random-seed";

export function generateRandomGray(seed: string) {
    const r = rand(seed);
    const bias = 100 + r.intBetween(-30, 30);
    function generateGrayComponent() {
        return (r.intBetween(-4, 4) + bias).toString(16);
    }

    const red = generateGrayComponent();
    const green = generateGrayComponent();
    const blue = generateGrayComponent();
    return `#${red}${green}${blue}`;
}