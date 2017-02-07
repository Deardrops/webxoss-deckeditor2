# 👕 Code style

## js

See eslint config.

## css

* `css-next` only
* One space behind `:`, `,`
* Indent by 2 spaces
* `;` required
* Color: `#aabbcc` or `#abc`, lower case
* No id selector
* No `!important`

## vue

Single file component with `script`, `template` and `style` *in order*.

Template:

```html
<div
  class="class"
  :data="data"
  @event="handler">
  <span>{{ text }}</span>
</div>
```

* Always use shorthand for `v-bind`, `v-on`
* Spaces in mustache

Style:

* ALWAYS use `scoped` or `module` on component style

# ♿️ Accessibility

* Always use `alt` on an image
* Do not use background for meaningful images
* Add `aria-label`/`aria-hidden` on meaningful/decorative icon
