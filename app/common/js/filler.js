function createEmptyImageData(imageData) {
    return new ImageData(new Uint8ClampedArray(imageData.data.length), imageData.width, imageData.height);
}
function draw_fill_without_pattern_support(fill_threshold,main_canvas,ctx, start_x, start_y, fill_r, fill_g, fill_b, fill_a,imageCallback) {
    fill_threshold = 20
	// @TODO: split up processing in case it takes too long?
	// progress bar and abort button (outside of image-manipulation.js)
	// or at least just free up the main thread every once in a while
	// @TODO: speed up with typed arrays? https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/
	// could avoid endianness issues if only copying colors
	// the jsperf only shows ~15% improvement
	// maybe do something fancier like special-casing large chunks of single-color image
	// (octree? or just have a higher level stack of chunks to fill and check at if a chunk is homogeneous)

	const c_width = main_canvas.width;
	const c_height = main_canvas.height;
	console.log({
		width: c_width,
		height: c_height,
	})
	start_x = Math.max(0, Math.min(Math.floor(start_x), c_width));
	start_y = Math.max(0, Math.min(Math.floor(start_y), c_height));
	const stack = [[start_x, start_y]];
	const id = ctx.getImageData(0, 0, c_width, c_height);
    const dummy = createEmptyImageData(id)
	let pixel_pos = (start_y * c_width + start_x) * 4;
	const start_r = id.data[pixel_pos + 0];
	const start_g = id.data[pixel_pos + 1];
	const start_b = id.data[pixel_pos + 2];
	const start_a = id.data[pixel_pos + 3];

	// @TODO: Allow flood-filling colors similar within fill threshold.
	// Right now it will cause an infinite loop if we don't stop early in this case.
	// As of writing, the fill threshold is very low, so this problem is unlikely to be noticed,
	// but it would be nice as a user-configurable option.
	if (
		Math.abs(fill_r - start_r) <= fill_threshold &&
		Math.abs(fill_g - start_g) <= fill_threshold &&
		Math.abs(fill_b - start_b) <= fill_threshold &&
		Math.abs(fill_a - start_a) <= fill_threshold
	) {
		return;
	}

	while (stack.length) {
		let new_pos;
		let x;
		let y;
		let reach_left;
		let reach_right;
		new_pos = stack.pop();
		x = new_pos[0];
		y = new_pos[1];

		pixel_pos = (y * c_width + x) * 4;
		while (should_fill_at(pixel_pos)) {
			y--;
			pixel_pos = (y * c_width + x) * 4;
		}
		reach_left = false;
		reach_right = false;
		// eslint-disable-next-line no-constant-condition
		while (true) {
			y++;
			pixel_pos = (y * c_width + x) * 4;

			if (!(y < c_height && should_fill_at(pixel_pos))) {
				break;
			}

			do_fill_at(pixel_pos);

			if (x > 0) {
				if (should_fill_at(pixel_pos - 4)) {
					if (!reach_left) {
						stack.push([x - 1, y]);
						reach_left = true;
					}
				} else if (reach_left) {
					reach_left = false;
				}
			}

			if (x < c_width - 1) {
				if (should_fill_at(pixel_pos + 4)) {
					if (!reach_right) {
						stack.push([x + 1, y]);
						reach_right = true;
					}
				} else if (reach_right) {
					reach_right = false;
				}
			}

			pixel_pos += c_width * 4;
		}
	}
    console.log(dummy)
imageCallback(dummy)

	function should_fill_at(pixel_pos) {
		return (
			// matches start color (i.e. region to fill)
			Math.abs(id.data[pixel_pos + 0] - start_r) <= fill_threshold &&
			Math.abs(id.data[pixel_pos + 1] - start_g) <= fill_threshold &&
			Math.abs(id.data[pixel_pos + 2] - start_b) <= fill_threshold &&
			Math.abs(id.data[pixel_pos + 3] - start_a) <= fill_threshold
		);
	}

	function do_fill_at(pixel_pos) {
		id.data[pixel_pos + 0] = fill_r;
		id.data[pixel_pos + 1] = fill_g;
		id.data[pixel_pos + 2] = fill_b;
		id.data[pixel_pos + 3] = fill_a;
        dummy.data[pixel_pos + 0] = fill_r;
        dummy.data[pixel_pos + 1] = fill_g;
		dummy.data[pixel_pos + 2] = fill_b;
		dummy.data[pixel_pos + 3] = fill_a;
	}
}