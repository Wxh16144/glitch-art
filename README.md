<div align="center">
  <a href="https://github.com/Wxh16144/glitch-art">
    <img src="https://glitch-art.vercel.app/Glitch%20Art?font=Sour+Gummy" alt="Glitch Art" />
  </a>
</div>

> Enjoy the glitch art effect on your text.

## Usage

The rendered text lives in the **path**; everything else is a short query alias.

> Any single-segment URL is a valid image — `/{YOUR%20TEXT}` renders it, even
> for words you haven't seen before. There is no word list to browse.

_\*.md_

```markdown
![Glitch Art](https://glitch-art.vercel.app/{YOUR%20TEXT})
```

_\*.html_

```html
<img src="https://glitch-art.vercel.app/{YOUR%20TEXT}" alt="Glitch Art" />
```

> Legacy links `/api/simple?word=...` are still served — they 301 to the canonical URL.

## Parameters

> Use `f` in URLs; the readable `font` alias is equivalent (shown in demos).

| Alias | Legacy | Description |
|---|---|---|
| — (path) | `word` | The text you want to display |
| `t` | `word` | Text as a query param (fallback when the path form is inconvenient) |
| `f` | `font` | Google Fonts name, find [here](https://fonts.google.com/) |
| `fs` | `fontSize` | Font size in px |
| `fw` | `fontWeight` | Font weight (`400`, `500`, …) |
| `w` | `width` | Canvas width in px (omitted → auto-fit to the text) |
| `h` | `height` | Canvas height in px (omitted → auto-fit to the text) |
| `c1` | `color1` | First (base) text color |
| `c2` | `color2` | Second (glitch) text color |
| `bg` | `background` | Background color |

### Smart sizing

Without `w`/`h`, the canvas auto-fits the rendered text (the embedded font is
measured server-side, so the result is tight with a small padding for the
glitch shake). When you pass `w` and/or `h` without `fs`, the font size is
auto-scaled to fit the canvas.

```html
<!-- auto canvas -->
<img src="https://glitch-art.vercel.app/Glitch%20Art" alt="Glitch Art" />

<!-- fixed canvas, auto font size -->
<img src="https://glitch-art.vercel.app/Passion?w=380&h=64" alt="Passion" />

<!-- fully controlled -->
<img src="https://glitch-art.vercel.app/Passion?fs=64&w=380&h=64&font=Sour%20Gummy&fw=500&c1=red&c2=cyan" alt="Passion" />
```
