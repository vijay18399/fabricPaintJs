
  

  
 function FloodFill() {
	
	this.collectModifiedPixels = false
	this.modifiedPixelsCount = 0
	this.modifiedPixels = new Set()
    this.callback = null;
	this._tolerance = 0
	this._queue = []
	this.colorToRGBA = function(color) {
		if (color.indexOf("rgba") !== -1) {
		  const [
			_,
			r,
			g,
			b,
			a
		  ] = /rgba\(.*?([0-9]{1,3}).*?([0-9]{1,3}).*?([0-9]{1,3}).*?([0-9\.]{1,})/g.exec(
			color
		  )
		  return {
			r: parseInt(r),
			g: parseInt(g),
			b: parseInt(b),
			a: Math.ceil(parseFloat(a) * 255)
		  }
		} else if (color.indexOf("rgb") !== -1) {
		  const [
			_,
			r,
			g,
			b
		  ] = /rgb\(.*?([0-9]{1,3}).*?([0-9]{1,3}).*?([0-9]{1,3})/g.exec(color)
		  return {
			r: parseInt(r),
			g: parseInt(g),
			b: parseInt(b),
			a: 255
		  }
		} else if (color.indexOf("#") !== -1) {
		  return this.hex2RGBA(color)
		} else {
		  throw new Error(
			"Unsupported color format. Please use CSS rgba, rgb, or HEX!"
		  )
		}
	  }
	this.getColorAtPixel = function(imageData, x, y) {
		const { width, data } = imageData
		const startPos = 4 * (y * width + x)
		if (data[startPos + 3] === undefined) {
		  throw new Error("Invalid pixel coordinates: x=" + x + "; y=" + y)
		}
		return {
		  r: data[startPos],
		  g: data[startPos + 1],
		  b: data[startPos + 2],
		  a: data[startPos + 3]
		}
	  }
	 this.isSameColor = function(a, b, tolerance = 0) {
		return !(
		  Math.abs(a.r - b.r) > tolerance ||
		  Math.abs(a.g - b.g) > tolerance ||
		  Math.abs(a.b - b.b) > tolerance ||
		  Math.abs(a.a - b.a) > tolerance
		)
	  }
	  
	 this.hex2RGBA =  function(hex, alpha = 255) {
		let parsedHex = hex
		if (hex.indexOf("#") === 0) {
		  parsedHex = hex.slice(1)
		}
		// convert 3-digit hex to 6-digits.
		if (parsedHex.length === 3) {
		  parsedHex =
			parsedHex[0] +
			parsedHex[0] +
			parsedHex[1] +
			parsedHex[1] +
			parsedHex[2] +
			parsedHex[2]
		}
		if (parsedHex.length !== 6) {
		  throw new Error(`Invalid HEX color ${parsedHex}.`)
		}
		const r = parseInt(parsedHex.slice(0, 2), 16)
		const g = parseInt(parsedHex.slice(2, 4), 16)
		const b = parseInt(parsedHex.slice(4, 6), 16)
		return {
		  r,
		  g,
		  b,
		  a: alpha
		}
	  }
	this.setColorAtPixel = function(imageData, color, x, y) {
		const { width, data } = imageData
		const startPos = 4 * (y * width + x)
		if (data[startPos + 3] === undefined) {
		  throw new Error(
			"Invalid pixel coordinates. Cannot set color at: x=" + x + "; y=" + y
		  )
		}
		data[startPos + 0] = color.r & 0xff
		data[startPos + 1] = color.g & 0xff
		data[startPos + 2] = color.b & 0xff
		data[startPos + 3] = color.a & 0xff
	  }
	this.init = function(imageData) {
	  this.imageData = imageData
	}
	/**
	 * color should be in CSS format - rgba, rgb, or HEX
	 */
	this.fill = function(color, x, y, tolerance,callback) {
	  this.callback = callback;
	  this._newColor = this.colorToRGBA(color)
	  this._replacedColor = this.getColorAtPixel(this.imageData, x, y)
	  this._tolerance = tolerance
	  if (
		this.isSameColor(this._replacedColor, this._newColor, this._tolerance)
	  ) {
		this.callback()
		return
	  }
  
	  this.addToQueue([x, x, y, -1])
	  this.fillQueue()
	}
  
	this.addToQueue = function(line) {
	  this._queue.push(line)
	}
  
	this.popFromQueue = function() {
	  if (!this._queue.length) {
		return null
	  }
	  return this._queue.pop()
	}
  
	this.isValidTarget = function(pixel) {
	  if (pixel === null) {
		return
	  }
	  const pixelColor = this.getColorAtPixel(this.imageData, pixel.x, pixel.y)
	  return this.isSameColor(this._replacedColor, pixelColor, this._tolerance)
	}
  
	this.fillLineAt = function(x, y) {
	  if (!this.isValidTarget({ x, y })) {
		return [-1, -1]
	  }
	  this.setPixelColor(this._newColor, { x, y })
	  let minX = x
	  let maxX = x
	  let px = this.getPixelNeighbour("left", minX, y)
	  while (px && this.isValidTarget(px)) {
		this.setPixelColor(this._newColor, px)
		minX = px.x
		px = this.getPixelNeighbour("left", minX, y)
	  }
	  px = this.getPixelNeighbour("right", maxX, y)
	  while (px && this.isValidTarget(px)) {
		this.setPixelColor(this._newColor, px)
		maxX = px.x
		px = this.getPixelNeighbour("right", maxX, y)
	  }
	  return [minX, maxX]
	}
  
	this.fillQueue = function() {
	  let line = this.popFromQueue()
	  while (line) {
		const [start, end, y, parentY] = line
		let currX = start
		while (currX !== -1 && currX <= end) {
		  const [lineStart, lineEnd] = this.fillLineAt(currX, y)
		  if (lineStart !== -1) {
			if (lineStart >= start && lineEnd <= end && parentY !== -1) {
			  if (parentY < y && y + 1 < this.imageData.height) {
				this.addToQueue([lineStart, lineEnd, y + 1, y])
			  }
			  if (parentY > y && y > 0) {
				this.addToQueue([lineStart, lineEnd, y - 1, y])
			  }
			} else {
			  if (y > 0) {
				this.addToQueue([lineStart, lineEnd, y - 1, y])
			  }
			  if (y + 1 < this.imageData.height) {
				this.addToQueue([lineStart, lineEnd, y + 1, y])
			  }
			}
		  }
		  if (lineEnd === -1 && currX <= end) {
			currX += 1
		  } else {
			currX = lineEnd + 1
		  }
		}
		line = this.popFromQueue()
	  }
	  if (!line) {
		this.callback(this.imageData);
	  }
	}
  
	this.setPixelColor = function(color, pixel) {
	  this.setColorAtPixel(this.imageData, color, pixel.x, pixel.y)
	  this.modifiedPixelsCount++
	  this.collectModifiedPixels &&
		this.modifiedPixels.add(`${pixel.x}|${pixel.y}`)
	}
  
	this.getPixelNeighbour = function(direction, x, y) {
	  x = x | 0
	  y = y | 0
	  let coords
	  switch (direction) {
		case "right":
		  coords = { x: (x + 1) | 0, y }
		  break
		case "left":
		  coords = { x: (x - 1) | 0, y }
		  break
	  }
	  if (coords.x >= 0 && coords.x < this.imageData.width) {
		return coords
	  }
	  return null
	}
  }
  