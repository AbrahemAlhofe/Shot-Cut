import { onDragDrop, absMax, compute, inRange } from "./utils";

/* ===========
    Elements
============== */
const Cursor: HTMLElement = document.querySelector('.cursor')
const Pointer: HTMLElement = document.querySelector('.pointer')
const Img: HTMLImageElement = document.querySelector('.view__image')
const Button: HTMLElement = document.querySelector('button')
const ShotsStack: HTMLElement = document.querySelector('.shots-stack')
const UploadBtn: HTMLButtonElement = document.querySelector('.view__upload-btn')
const InputFile : HTMLInputElement = document.querySelector('#upload')

/* ===========
Data
============== */
const LIMIT: number = ( ( Pointer.offsetHeight / 2 ) - ( Cursor.offsetHeight / 2 ) )
const SCALE: number = 5
const MAX_ASPECT_RATIO: number = 2
const MAX_IMAGE_WIDTH: number = 600

const data = {
    Distance : { x : 0, y : 0 },
    isCursorMove : false,
    CursorPosition : compute({ x : 0, y : 0 }, function () {
        this.x = absMax(data.Distance["x"], LIMIT);
        this.y = absMax(data.Distance["y"], LIMIT);
    }),
    ImagePosition : compute({ x : 0, y : 0 }, () => {}),
    ImageWidth : 0,
    ImageHeight : 0,
    ImageSrc : window.getComputedStyle(Img).backgroundImage.slice(5, window.getComputedStyle(Img).backgroundImage.length - 2),
    ImageAspectRatio : 0
}

/* ===========
    Logic
============== */

function updateView (): void {

    Cursor.style.transform = `translate(${ data.CursorPosition['x'] }px, ${ data.CursorPosition['y'] }px)`

    Img.style.backgroundPosition = `${ data.ImagePosition['x'] }px ${ data.ImagePosition['y'] }px`
    
    if ( data.isCursorMove ) Img.classList.add("image--move");
    else Img.classList.remove("image--move");

    if ( data.isCursorMove ) Cursor.classList.add('cursor--move')
    else Cursor.classList.remove('cursor--move')

    Img.style.backgroundImage = `url(${ data.ImageSrc })`

    Img.style.backgroundSize = `${ Img.offsetWidth * SCALE }px ${ Img.offsetHeight * SCALE }px`

}

var interval: number;

function mousedown (e: MouseEvent) {}

function mousemove (e: MouseEvent, { x, y }) {
    data.isCursorMove = true

    let distance = Math.sqrt( ( x ** 2 ) + ( y ** 2 ) )
    
    data.Distance['x'] = x

    data.Distance['y'] = y

    if ( distance > LIMIT && interval === undefined ) {

        interval = setInterval( () => {

            data.ImagePosition()

            updateView();

        }, 1000 / 24 )

    }

    data.CursorPosition()

    data.ImagePosition();

    updateView()
}

function mouseup() {
    data.CursorPosition['x'] = 0
    data.CursorPosition['y'] = 0
    
    clearInterval( interval )
    interval = undefined
    updateView();
}

onDragDrop( Cursor, mousedown, mousemove, mouseup )

const img: HTMLImageElement = new Image()

img.onload = () => {
    data.ImageWidth = img.naturalWidth 
    data.ImageHeight = img.naturalHeight;
    data.ImageAspectRatio = data.ImageWidth / data.ImageHeight

    let height = 300

    if ( data.ImageAspectRatio > MAX_ASPECT_RATIO ) height = MAX_IMAGE_WIDTH / data.ImageAspectRatio

    Img.style.height = `${ height }px`;
    Img.style.width = `${ height * data.ImageAspectRatio }px`
    
    data.ImagePosition = compute(
        {
            x : ( Img.offsetWidth - ( Img.offsetWidth * SCALE ) ) * .5,
            y : ( Img.offsetHeight - ( Img.offsetHeight * SCALE ) ) * .5
        },
        function () {
            let x = this.x + absMax(data.Distance["x"], 5) * -1
            let y = this.y + absMax(data.Distance["y"], 5) * -1

            this.x = inRange( x, ( Img.offsetWidth * -5 ) + Img.offsetWidth, 0 )

            this.y = inRange( y, ( Img.offsetHeight * -5 ) + Img.offsetHeight, 0 )
        }
    )

    updateView()
}

img.src = data.ImageSrc

function createCanvas (): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext("2d");

    const aspectRatio = 2
    canvas.width = Img.offsetWidth / aspectRatio;
    canvas.height = Img.offsetHeight / aspectRatio;

    const imgWidth = canvas.width * SCALE;
    const imgHeight = canvas.height * SCALE;

    let x = data.ImagePosition["x"] / aspectRatio;
    let y = data.ImagePosition["y"] / aspectRatio;

    context.drawImage(img, x, y, imgWidth, imgHeight);

    return canvas
}

function createShot (): HTMLDivElement {
    const Shot = document.createElement('div')
    Shot.classList.add('shot')    
    
    // Childrens
    const Canvas: HTMLCanvasElement = Shot.appendChild( createCanvas() )
    
    return Shot
}

Button.addEventListener('click', () => ShotsStack.appendChild( createShot() ))

UploadBtn.addEventListener('click', () => {
    InputFile.click()
    InputFile.addEventListener('change', (e) => {
        const image: File = InputFile.files[0]
        const reader = new FileReader()

        reader.addEventListener("load", function () {
            data.ImageSrc = this.result.toString()
            img.src = this.result.toString()
            updateView()
        });

        reader.readAsDataURL(image);

        console.log(image)
    })
})