export function onDragDrop (
    element,
    mousedown: (e: MouseEvent) => void | boolean,
    mousemove: (e: MouseEvent, position? : { x : number, y: number }) => any,
    mouseup: (e: MouseEvent) => void
) {
  let point_1 = { x : 0, y : 0 }

  let isMouseUp = false
  let isMouseDown = false
  let isMouseMove = false

  element.addEventListener("mousedown", (e: MouseEvent) => {
    console.log( mousedown(e) )
    if ( mousedown(e) ) {
      isMouseDown = true
      isMouseUp = false
      point_1 = { x: e.pageX, y: e.pageY };
    }
  });

  document.body.addEventListener("mouseup", (e: MouseEvent) => {

    if ( isMouseDown && isMouseMove ) {
      isMouseUp = true;
      mouseup(e);
    }

  });

  document.body.addEventListener("mousemove", (e: MouseEvent) => {
    if ( !isMouseUp && isMouseDown ) {
      isMouseMove = true
      mousemove(e, { x: e.pageX - point_1.x, y: e.pageY - point_1.y });
    }
  });

}

export function absMax(num: number, limit: number): number {
  limit = limit * (num < 0 ? -1 : 1);
  return Math.abs(num) > Math.abs(limit) ? limit : num;
}

export function compute< T extends Object >( data: T, handler: ( this: T ) => void): () => T | T {
    return new Proxy(() => data, {
      set (target, key, value) {
        target()[key] = value
        return true
      },
      get (target, key) { return target()[key] },
      apply ( target ) {
        handler.apply(target());
        return target()
      }
    })

}

export function inRange (num: number, min: number, max: number) {
  if ( num < min ) return min
  if ( num > max ) return max
  return num
}

export interface IPosition { x : number, y : number }