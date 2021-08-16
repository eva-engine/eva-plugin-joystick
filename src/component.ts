import { Component, GameObject, resource, RESOURCE_TYPE } from '@eva/eva.js'
import { Event, HIT_AREA_TYPE } from '@eva/plugin-renderer-event';
import { Img } from '@eva/plugin-renderer-img';

export enum JOYSTICK_EVENT {
  Begin = 'Begin',
  Drag = 'Drag',
  End = 'End',
}

interface JoystickParams {
  limitRadius?: number
  boxImageResource?: string;
  boxRadius?: number;
  btnImageResource?: string;
  btnRadius?: number;
  followPointer?: { open: true, area: { x?: number, y?: number, width: number, height: number } } | { open: false }
}

export default class Joystick extends Component<JoystickParams> {
  static componentName = 'Joystick';
  readonly name = 'Joystick';

  limitRadius: number = 70

  boxImageResource: string = '_Joystick_box';
  boxRadius: number = 100;

  btnImageResource: string = '_Joystick_btn';
  btnRadius: number = 20

  followPointer: JoystickParams['followPointer'] = { open: false }

  private boxGO: GameObject
  private btnGO: GameObject
  private evt: Event

  private vector2: { x: number, y: number } = { x: 0, y: 0 }

  private basePosition = { x: 0, y: 0 }

  private moving = false

  private triggerTouchstart = false
  private triggerTouchend = false

  private eventBinded = false

  private pointerId

  init(params) {
    this.limitRadius = params.limitRadius || this.limitRadius

    this.boxImageResource = params.boxImageResource || this.boxImageResource
    this.boxRadius = params.boxRadius || this.boxRadius

    this.btnImageResource = params.btnImageResource || this.btnImageResource
    this.btnRadius = params.btnRadius || this.btnRadius

    this.followPointer = params.followPointer || this.followPointer

    this.initResource(params)

    this.boxGO = this.createGO('box', this.boxImageResource, this.boxRadius)
    this.btnGO = this.createGO('btn', this.btnImageResource, this.btnRadius, this.boxGO)

  }

  update(e) {
    if (!this.eventBinded && this.gameObject.scene) {
      this.eventBinded = true
      this.bindTouch()
      this.createFollowPointer()
    }

    if (this.triggerTouchstart) {
      this.emit(JOYSTICK_EVENT.Begin, {
        ...this.vector2,
        updateParams: e
      })
      this.triggerTouchstart = false
    }
    if (this.moving) {
      this.emit(JOYSTICK_EVENT.Drag, {
        ...this.vector2,
        updateParams: e
      })
    }
    if (this.triggerTouchend) {
      this.emit(JOYSTICK_EVENT.End, {
        ...this.vector2,
        updateParams: e
      })
      this.triggerTouchend = false
    }

    this.btnGO.transform.position.x = this.vector2.x * this.limitRadius
    this.btnGO.transform.position.y = this.vector2.y * this.limitRadius

  }

  private bindTouch() {
    if (this.followPointer.open) {
      const evtGO = new GameObject('JoyStick_evt')
      this.evt = evtGO.addComponent(new Event({
        hitArea: {
          type: HIT_AREA_TYPE.Rect,
          style: { ...this.followPointer.area }
        }
      }))
      this.gameObject.scene.addChild(evtGO)
    } else {
      this.evt = this.gameObject.addComponent(new Event())
    }

    this.moving = false
    this.evt.on('touchstart', (e) => {
      this.moving = true
      this.basePosition.x = e.data.position.x
      this.basePosition.y = e.data.position.y
      this.triggerTouchstart = true
      this.pointerId = e.data?.pointerId
    })

    this.evt.on('touchmove', (e) => {
      if (!this.moving) return
      if (undefined !== e.data?.pointerId && this.pointerId !== e.data.pointerId) return
      const position = e.data.position

      const vector2 = this.vector2
      vector2.x = (position.x - this.basePosition.x) / this.limitRadius
      vector2.y = (position.y - this.basePosition.y) / this.limitRadius

      const vector2Pow = {
        x: vector2.x ** 2,
        y: vector2.y ** 2,
      }

      if (vector2Pow.x + vector2Pow.y > 1) {
        const sqrt = Math.sqrt(vector2Pow.x + vector2Pow.y)
        vector2.x /= sqrt
        vector2.y /= sqrt
      }
    })
    const touchend = (e) => {
      if (undefined !== e.data?.pointerId && this.pointerId !== e.data.pointerId) return
      this.moving = false
      this.vector2.x = 0
      this.vector2.y = 0
      this.triggerTouchend = true
    }
    this.evt.on('touchend', touchend)
    this.evt.on('touchendoutside', touchend)
  }

  private createGO(name, resource, radius, parent?: GameObject) {
    const go = new GameObject('Joystick_' + name, {
      size: {
        width: radius * 2,
        height: radius * 2,
      },
      origin: {
        x: 0.5,
        y: 0.5
      },
      anchor: {
        x: 0.5,
        y: 0.5
      }
    })

    go.addComponent(new Img({
      resource
    }));

    (parent || this.gameObject).addChild(go)
    return go
  }


  createFollowPointer() {
    if (!this.followPointer.open) return

    this.evt.on('touchstart', ({ data }) => {
      this.gameObject.transform.position.x = data.position.x
      this.gameObject.transform.position.y = data.position.y
    })
  }
  initResource(params) {
    if (!params.btnImageResource) {
      resource.addResource([{
        type: RESOURCE_TYPE.IMAGE,
        name: '_Joystick_btn',
        src: {
          image: {
            type: 'png',
            url: 'https://raw.githubusercontent.com/fanmingfei/eva-plugin-joystick/main/public/btn.png'
          }
        }
      }])
    }
    if (!params.boxImageResource) {
      resource.addResource([{
        type: RESOURCE_TYPE.IMAGE,
        name: '_Joystick_box',
        src: {
          image: {
            type: 'png',
            url: 'https://raw.githubusercontent.com/fanmingfei/eva-plugin-joystick/main/public/box.png'
          }
        }
      }])
    }
  }
}