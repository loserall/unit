
class VerCode {
  constructor(option = {}) {
    this.canvas = null
    this.paint = null
    this.callback = null
    this.content = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    this.backgroundColor = option.backgroundColor || [50, 250]
    this.foregroundColor = option.foregroundColor || [10, 50]
    this.lineNum = option.lineNum || 3
    this.dotNum = option.dotNum || 50
    this.dotR = option.dotR || 1
    this.len = option.len || 4
    this.fontSize = option.fontSize || 14
    this.fontFamily = option.fontFamily || ''
    this.fontStyle = option.fontStyle || 'fill' // 字体绘制方法，fill/stroke
  }

  draw (dom, callback) {
    if (!this.paint) {
      this.canvas = dom;
      if (!this.canvas) return
      this.paint = this.canvas.getContext('2d')
      if (!this.paint) return
      this.callback = callback
      this.canvas.onclick = () => {
        this.drawAgain();
      }
    }
    // 随机画布颜色，使用背景色
    this.paint.fillStyle = this.randomColor(this.backgroundColor[0], this.backgroundColor[1]);
    // 绘制画布
    this.paint.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // 绘图
    this.arc();
    this.line();
    this.font();
  }

  arc () {
    for (let i = 0; i < this.dotNum; i++) {
      // 随机获取圆心
      let x = this.random(0, this.canvas.width), y = this.random(0, this.canvas.height);
      this.paint.beginPath();

      // 指定圆周路径
      this.paint.arc(x, y, this.dotR, 0, Math.PI * 2, false);
      this.paint.closePath();

      // 随机获取路径颜色
      this.paint.fillStyle = this.randomColor(this.foregroundColor[0], this.foregroundColor[1]);

      // 绘制
      this.paint.fill();
    }

  }

  line () {
    for (let i = 0; i < this.lineNum; i++) {
      // 随机获取线条的起止坐标
      let x = this.random(0, this.canvas.width), y = this.random(0, this.canvas.height),
        endx = this.random(0, this.canvas.width), endy = this.random(0, this.canvas.width);
      this.paint.beginPath(); // 开始绘制
      this.paint.lineWidth = this.lineWidth;
      // 随机获取路径颜色
      this.paint.strokeStyle = this.randomColor(this.foregroundColor[0], this.foregroundColor[1]); // 使用前景色
      // 指定绘制路径
      this.paint.moveTo(x, y);
      this.paint.lineTo(endx, endy);
      this.paint.closePath();
      this.paint.stroke(); // 进行绘制
    }
  }

  font () {
    let str = this.getText(); // 获取验证码
    this.callback(str); // 利用回调函数输出文字，用于与用户输入验证码进行比对
    // 指定文字风格
    this.paint.font = `${this.fontSize}px ${this.fontFamily}`;
    this.paint.textBaseline = 'middle'; // 设置文本基线，middle是整个文字所占方框的高度的正中。
    // 指定文字绘制风格
    let fontStyle = `${this.fontStyle}Text`;
    let colorStyle = `${this.fontStyle}Style`;
    for (let i = 0; i < this.len; i++) { // 循环绘制每个字
      let fw = this.paint.measureText(str[i]).width; // 获取文字绘制的实际宽度
      // 获取每个字的允许范围，用来确定绘制单个文字的横坐标
      let x = this.random(this.canvas.width / this.len * i, (this.canvas.width / this.len) * i + fw / 2);
      // 随机获取字体的旋转角度
      let deg = this.random(-6, 6);
      // 随机获取文字颜色
      this.paint[colorStyle] = this.randomColor(this.foregroundColor[0], this.foregroundColor[1]);
      // 开始绘制
      this.paint.save();
      this.paint.rotate(deg * Math.PI / 180);
      this.paint[fontStyle](str[i], x, this.canvas.height / 2);
      this.paint.restore();
    }
  }

  clear () {
    this.paint.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
  drawAgain () {
    this.clear()
    this.draw(this.callback)
  }

  getText () {
    let len = this.content.length, str = '';
    for (let i = 0; i < this.len; i++) {
      str += this.content[this.random(0, len)];
    }
    return str;
  }


  //生成随机数
  random = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + 1
  //生成随机颜色
  randomColor = (min, max) => `rgb(${random(min, max)},${random(min, max)},${random(min, max)})`
}


/**
 * 参考 https://juejin.im/post/5c7b524ee51d453ee81877a7#heading-13
*/