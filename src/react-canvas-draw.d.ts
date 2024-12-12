declare module 'react-canvas-draw' {
  import { Component } from 'react';
  export default class CanvasDraw extends Component<any> {
    clear(): void;
    canvas: {
      drawing: HTMLCanvasElement;
    };
  }
} 