# Design Notes: Front Page Image Collage

**Preferred Grid Layout Format**
The user has confirmed that the perfect format for the hero image collage is a **6 columns by 4 rows grid** (24 total images).

This configuration provides grid cells that are "slightly landscape" / almost square, which is the mathematically optimal sweet spot for fitting car photos without cutting off the sides or the bottom of the subject.

## Specifications
When new images are added to the front page collage, follow these CSS rules:

1. **Grid Layout**: 
   - `display: grid;`
   - `grid-template-columns: repeat(6, 1fr);`
   - `grid-template-rows: repeat(4, 1fr);`
   - Remove any gaps or padding (`gap: 0; padding: 0;`).

2. **Image Fit Rules**:
   - `object-fit: cover;`
   - `object-position: center;`
   - `width: 100%; height: 100%;`

3. **Total Images**:
   - Exactly **24 images** should be placed in the HTML container to perfectly fill the 6x4 grid without leaving blank spaces. 
   - If fewer or more images are available, adjust the total count to exactly 24 (either by duplicating a few or omitting lower-quality thumbnails). 

**Do NOT use:**
- `object-fit: contain` (leaves black gaps)
- `object-position: center bottom` (forces ugly top-heavy cropping)
- `5x5 grid` or `8x3 grid` (causes extreme aspect ratio stretching and cuts off subjects)
