const View: HTMLImageElement = document.querySelector(".view__image");

export default class Shots {

    ShotsElement: HTMLElement

    constructor () {
        this.ShotsElement = document.querySelector('.shots-stack')
    }

    push (image: HTMLImageElement): void {
        /*
            Create Canvas
        */
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const aspectRatio = 2;
        
        canvas.width = View.offsetWidth / aspectRatio;
        
        canvas.height = View.offsetHeight / aspectRatio;

        context.drawImage(
            image,
            data.ImagePosition["x"] / aspectRatio,
            data.ImagePosition["y"] / aspectRatio,
            canvas.width * SCALE,
            canvas.height * SCALE
        );

        /*
            Create Shot
        */
        const Shot = document.createElement("div");
        Shot.classList.add("shot");

        // Childrens
        Shot.appendChild( canvas );

        this.ShotsElement.appendChild( Shot );
    }

}