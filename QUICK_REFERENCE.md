# 🌿 Quick Reference Guide - Grocery Store Green Theme

## Color Variables Quick Lookup

### Primary Greens
```css
#1B5E20  var(--primary-dark)      Dark forest green (brand anchor)
#2E7D32  var(--primary-main)      Vibrant green (primary buttons)
#4CAF50  var(--primary-light)     Fresh green (hover states)
#81C784  var(--primary-lighter)   Light green (accents)
#C8E6C9  var(--primary-lightest)  Very light green (backgrounds)
```

### Secondary Colors
```css
#00796B  var(--secondary-dark)    Dark teal
#009688  var(--secondary-main)    Medium teal
#4DB6AC  var(--secondary-light)   Light teal
```

### Semantic & Utility
```css
#2E7D32  var(--success)           Success (same as primary-main)
#F57C00  var(--warning)           Warning (orange)
#C62828  var(--error)             Error (red)
#1565C0  var(--info)              Info (blue)
#FBC02D  var(--accent-gold)       Gold accent
```

### Neutrals
```css
#1A1A1A  var(--neutral-dark)      Dark text
#424242  var(--neutral-600)       Medium-dark text
#757575  var(--neutral-500)       Medium text
#BDBDBD  var(--neutral-400)       Light text / placeholder
#E0E0E0  var(--neutral-300)       Border color
#F5F5F5  var(--neutral-200)       Light background
#FAFAFA  var(--neutral-100)       Off-white background
#FFFFFF  var(--white)             Pure white
```

---

## Color Usage by Component

### Navbar
```
Background:    --primary-main → --secondary-main (gradient)
Text:          white / rgba(255, 255, 255, 0.85)
Links Hover:   --accent-gold
Button:        --accent-gold
Button Hover:  #FFC125 (gold)
```

### Header/Hero
```
Background:    --gradient-primary
Text:          white
Button:        --accent-gold
Decorative:    green radials
```

### Footer
```
Background:    --primary-dark → --primary-main (gradient)
Text:          rgba(255, 255, 255, 0.7 or 0.9)
Links Hover:   --accent-gold
Divider:       rgba(255, 255, 255, 0.2)
```

### Product Cards
```
Background:    white
Border:        transparent (green on hover)
Price:         --primary-main
Add Button:    --primary-light → --secondary-light (gradient)
Hover Border:  --primary-light
```

### Buttons & CTAs
```
Primary:       --gradient-primary
Secondary:     --accent-gold
Hover:         --primary-lighter with shadow increase
Active:        --primary-dark
Error/Delete:  --error
```

### Input Fields
```
Border Default:   --neutral-300
Border Focus:     --primary-light
Background:       --neutral-200
Text:            --neutral-dark
Placeholder:      --neutral-400
```

---

## File Locations

### Color System Definitions
```
frontend/src/styles/colors.css       (Frontend colors)
admin/src/styles/colors.css          (Admin colors)
```

### Major Components to Update
```
frontend/src/index.css               (Global styles)
frontend/src/components/Navbar/      (Navigation)
frontend/src/components/Header/      (Hero section)
frontend/src/components/Footer/      (Footer)
frontend/src/components/FoodItem/    (Product cards)
frontend/src/pages/Cart/             (Shopping cart)
frontend/src/pages/PlaceOrder/       (Checkout)

admin/src/index.css                  (Global styles)
admin/src/components/Navbar/         (Admin top bar)
admin/src/components/Sidebar/        (Navigation)
admin/src/pages/Add/                 (Add products)
admin/src/pages/List/                (Product list)
admin/src/pages/Orders/              (Order management)
```

---

## Common CSS Patterns

### Green Button
```css
background: linear-gradient(135deg, var(--primary-light) 0%, var(--secondary-light) 100%);
color: white;
padding: 12px 24px;
border-radius: var(--radius-sm);
box-shadow: var(--shadow-md);
transition: all var(--transition-normal);
```

### Hover Effect
```css
:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### Green Border with Hover
```css
border: 1px solid transparent;
:hover {
  border-color: var(--primary-light);
}
```

### Focus State (Accessibility)
```css
:focus {
  outline: 2px solid var(--primary-light);
  outline-offset: 2px;
}
```

### Input with Green Focus
```css
border: 1px solid var(--neutral-300);
:focus {
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}
```

---

## Updating Colors - How To

### Change Primary Green
Edit `colors.css`:
```css
--primary-dark: #NEW_COLOR;
--primary-main: #NEW_COLOR;
--primary-light: #NEW_COLOR;
```
All components automatically update!

### Change Gold Accent
```css
--accent-gold: #NEW_COLOR;
```

### Add New Color
```css
:root {
  --your-color-name: #HEX_CODE;
}
```
Then use in components:
```css
background: var(--your-color-name);
```

---

## Accessibility Checklist

- ✅ Colors defined with sufficient contrast (7:1 for text)
- ✅ Green + Red not used alone (use patterns too)
- ✅ Focus states clearly visible
- ✅ Hover states indicate interactivity
- ✅ Semantic colors used (red = error, green = success)
- ✅ No important information conveyed by color alone

---

## Brand Colors Quick Copy-Paste

### Primary Actions
```css
background: linear-gradient(135deg, var(--primary-main) 0%, var(--secondary-main) 100%);
```

### Secondary Actions
```css
background: var(--accent-gold);
```

### Success States
```css
color: var(--success);
border-color: var(--success);
```

### Error States
```css
color: var(--error);
background: rgba(198, 40, 40, 0.1);
```

### Neutral Background
```css
background: var(--neutral-100);
```

### Light Green Background
```css
background: var(--primary-lightest);
```

---

## Responsive Breakpoints

```css
@media (max-width: 1050px) {
  /* Tablet & large mobile adjustments */
}

@media (max-width: 750px) {
  /* Mobile adjustments */
}
```

Colors remain the same across all breakpoints.

---

## Design Tokens Used

```css
/* Shadows */
var(--shadow-sm)
var(--shadow-md)
var(--shadow-lg)
var(--shadow-xl)

/* Border Radius */
var(--radius-xs)    4px
var(--radius-sm)    8px
var(--radius-md)    12px
var(--radius-lg)    16px
var(--radius-xl)    24px

/* Transitions */
var(--transition-fast)     0.2s ease
var(--transition-normal)   0.3s ease
var(--transition-slow)     0.5s ease

/* Gradients */
var(--gradient-primary)    Green gradient
var(--gradient-secondary)  Teal gradient
var(--gradient-dark)       Dark green gradient
```

---

## Common Issues & Solutions

### Colors Look Different on Mobile
- Check media query overrides
- Ensure variables are imported in global CSS
- Test on actual devices, not just browser resize

### Hover Effects Not Working
- Check `transition` property is set
- Verify `:hover` pseudo-class syntax
- Use `var(--transition-normal)` for consistency

### Text Not Visible
- Check contrast ratio (should be 4.5:1+)
- Try darker text on light backgrounds
- Use `--neutral-dark` instead of custom color

### Shadow Not Showing
- Use `var(--shadow-md)` or larger
- Check for `overflow: hidden` cutting off shadow
- Verify shadow color has opacity (not pure black)

---

## Testing Checklist

- [ ] All buttons use green or gold
- [ ] Hover states are visible
- [ ] Text contrast is 7:1 or higher
- [ ] Focus outlines are green
- [ ] Mobile looks good in green
- [ ] Tablet view is consistent
- [ ] Dark backgrounds use white text
- [ ] Light backgrounds use dark text
- [ ] Shadows are consistent
- [ ] Gradients render smoothly

---

## Quick Copy-Paste Templates

### New Button Component
```css
.new-button {
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--secondary-light) 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 600;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
}

.new-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### New Card Component
```css
.new-card {
  background: white;
  padding: 24px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  border: 1px solid transparent;
  transition: all var(--transition-normal);
}

.new-card:hover {
  border-color: var(--primary-light);
  box-shadow: var(--shadow-lg);
}
```

### New Input Component
```css
.new-input {
  background: var(--neutral-200);
  border: 1px solid var(--neutral-300);
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--neutral-dark);
  transition: all var(--transition-normal);
}

.new-input:focus {
  outline: none;
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}
```

---

## Color Hex Reference Poster

```
🟢 GREENS
Dark:     #1B5E20  ███
Main:     #2E7D32  ███
Light:    #4CAF50  ███
Lighter:  #81C784  ███
Lightest: #C8E6C9  ███

🔵 TEALS
Dark:  #00796B  ███
Main:  #009688  ███
Light: #4DB6AC  ███

⚙️ NEUTRALS
Dark:  #1A1A1A  ███
600:   #424242  ███
500:   #757575  ███
400:   #BDBDBD  ███
300:   #E0E0E0  ███
200:   #F5F5F5  ███
100:   #FAFAFA  ███

⭐ SPECIAL
Gold:  #FBC02D  ███
Error: #C62828  ███
```

---

**Need to update a color? Edit `colors.css`**  
**Need a new component? Use templates above**  
**Need accessibility help? Check WCAG AA standards**

Keep this guide nearby for quick reference! 🌿
