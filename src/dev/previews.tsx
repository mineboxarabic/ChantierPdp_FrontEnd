import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import Home from "../pages/Home.tsx";
import App from "../App.tsx";
import Step1 from "../pages/PDPSteps/Step1.tsx";
import Step3 from "../pages/PDPSteps/Step3.tsx";
import Step4 from "../pages/PDPSteps/Step4.tsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Home">
                <Home/>
            </ComponentPreview>
            <ComponentPreview path="/App">
                <App/>
            </ComponentPreview>
            <ComponentPreview path="/Step1">
                <Step1/>
            </ComponentPreview>
            <ComponentPreview path="/Step3">
                <Step3/>
            </ComponentPreview>
            <ComponentPreview path="/Step4">
                <Step4/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;