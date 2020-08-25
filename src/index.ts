import { onDragDrop, absMax, compute, inRange, IPosition } from "./utils";
import Shots from "./shots";

/* ===========
    Elements
============== */
const Cursor: HTMLElement = document.querySelector('.cursor')
const Pointer: HTMLElement = document.querySelector('.pointer')
const View: HTMLImageElement = document.querySelector('.view__image')
const Button: HTMLElement = document.querySelector('button')
const UploadBtn: HTMLButtonElement = document.querySelector('.view__upload-btn')
const Zoom_Bar: HTMLElement = document.querySelector('.view__zoom-bar div')
const Zoom_Value: HTMLElement = document.querySelector(".view__zoom-value");
const InputFile : HTMLInputElement = document.querySelector('#upload')

/* ===========
Data
============== */
declare global {
    var SCALE : number
    var LIMIT : number
    var MAX_ASPECT_RATIO : number
    var MAX_IMAGE_WIDTH : number
    var data : {
        Distance : IPosition,
        isCursorMove : boolean,
        CursorPosition : () => IPosition | IPosition,
        ImagePosition : () => IPosition | IPosition,
        ImageWidth : number,
        ImageHeight : number,
        ImageSrc : string,
        ImageAspectRatio : number
    }
}

window.LIMIT = ( ( Pointer.offsetHeight / 2 ) - ( Cursor.offsetHeight / 2 ) )
window.SCALE = 3
window.MAX_ASPECT_RATIO = 2
window.MAX_IMAGE_WIDTH = 600

window.data = {
    Distance : { x : 0, y : 0 },
    isCursorMove : false,
    CursorPosition : compute({ x : 0, y : 0 }, function () {
        this.x = absMax(data.Distance["x"], LIMIT);
        this.y = absMax(data.Distance["y"], LIMIT);
    }),
    ImagePosition : compute({ x : 0, y : 0 }, () => {}),
    ImageWidth : 0,
    ImageHeight : 0,
    ImageSrc : window.getComputedStyle(View).backgroundImage.slice(5, window.getComputedStyle(View).backgroundImage.length - 2),
    ImageAspectRatio : 0
}

/* ===========
    Logic
============== */

function updateView (): void {

    Cursor.style.transform = `translate(${ data.CursorPosition['x'] }px, ${ data.CursorPosition['y'] }px)`

    View.style.backgroundPosition = `${ data.ImagePosition['x'] }px ${ data.ImagePosition['y'] }px`
    
    if ( data.isCursorMove ) View.classList.add("image--move");
    else View.classList.remove("image--move");

    if ( data.isCursorMove ) Cursor.classList.add('cursor--move')
    else Cursor.classList.remove('cursor--move')

    View.style.backgroundImage = `url(${ data.ImageSrc })`

    View.style.backgroundSize = `${ View.offsetWidth * SCALE }px ${ View.offsetHeight * SCALE }px`

    Zoom_Bar.style.width = `${ SCALE / 5 * 100 }%`

    Zoom_Bar.style.backgroundImage = `linear-gradient(45deg, #FF5722 ${ 100 - ( SCALE / 5 * 100 ) }%, #FFC107)`;

    Zoom_Value.innerText = `${ SCALE }00%`
}

var interval: number;

function mousedown (e: MouseEvent) { return true }

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

    let height = 300 // You can specify the value what do you want

    if ( data.ImageAspectRatio > MAX_ASPECT_RATIO ) height = MAX_IMAGE_WIDTH / data.ImageAspectRatio

    View.style.height = `${ height }px`;
    View.style.width = `${ height * data.ImageAspectRatio }px`
    
    data.ImagePosition = compute(
      {
        x: (View.offsetWidth - View.offsetWidth * SCALE) * 0.5,
        y: (View.offsetHeight - View.offsetHeight * SCALE) * 0.5,
      },
      function () {
        let x = this.x + absMax(data.Distance["x"], 5) * -1;
        let y = this.y + absMax(data.Distance["y"], 5) * -1;

        this.x = inRange(x, View.offsetWidth * ( SCALE * -1 ) + View.offsetWidth, 0);

        this.y = inRange(y, View.offsetHeight * ( SCALE * -1 ) + View.offsetHeight, 0);
      }
    );

    updateView()
}

img.src = data.ImageSrc

const shots = new Shots()
Button.addEventListener('click', () => shots.push( img ))

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

onDragDrop(Zoom_Bar,
    // Mouse Down
    (e) => {
        let start = Zoom_Bar.getBoundingClientRect().left + Zoom_Bar.offsetWidth - 100;
        return e.pageX > start
    },
    // Mouse Move
    (e) => {
        let unit = Zoom_Bar.parentElement.offsetWidth / 5
        let x = e.pageX - Zoom_Bar.getBoundingClientRect().left

        SCALE = Math.round( x / unit )
        console.log( x, x / unit )
        updateView()
    },
    // Mouse Up
    () => {

    }
)