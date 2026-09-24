/* ==========================================================================
   LEFT RIGHT — character rig
   --------------------------------------------------------------------------
   ONE SVG rig in a flat cutout-cartoon style, drawn facing right. LEFTY
   (red, left) uses it as drawn; RIGHTY (blue, right) is the same rig
   mirrored and recoloured. Same body, face and size for both fighters.
   Only the hair differs (gal: blonde shoulder-length bob and lashes /
   guy: short black hair and glasses). Hats (beanie + pom-pom / cap +
   brim) are an optional extra per team, off by default.

   Parts (ids in RIG_MARKUP):
     #char-body  #char-head  #char-hat  #char-eyes  #char-pupils  #char-brows
     #char-mouth #char-arm-l #char-arm-r #char-legs
   Helpers:
     #char-root #char-upper (lean) #char-face #char-brow-l/-r #char-leg-l/-r
     #char-jaw #char-flush #char-veins #char-ears #char-steam #char-spit
     #char-glasses #char-lock-l/-r #char-tuft #char-pom #char-brim
     (the last five swing with the secondary "flop" motion)
   "-l" / "-r" mean image-left / image-right in the un-mirrored drawing, so
   #char-arm-r is always the arm nearest the opponent.

   Two characters share one page, so every clone moves its ids to
   data-part="char-…" and gets unique prefixed ids (for the mouth clipPath).

   Transform origins live in the markup as data-pivot="x y" (viewBox units)
   and are used as the rotate/scale centres below, so they hold up under
   mirroring. Everything is driven by transforms and opacity only.
   ========================================================================== */
(function (root) {
  'use strict';

  const LR = (root.LR = root.LR || {});

  /* RIG MARKUP:START */
  const RIG_MARKUP = `
<svg class="rig" viewBox="0 0 400 460" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<g id="char-root">
<ellipse class="f-shadow" cx="204" cy="447" rx="112" ry="10"/>
<g id="char-legs" data-pivot="202 410">
<g id="char-leg-l" data-pivot="176 410">
<path class="f-pants line" d="M157.5 396.4C160.8 393.3 189.1 393 192.4 396.1C195.7 399.3 194 424.9 190.6 428.1C187.3 431.2 162.5 430.7 159.2 427.6C155.9 424.4 154.2 399.6 157.5 396.4Z"/>
<path class="f-shoe line" d="M145.9 432.9C146.1 429 147.7 423.8 153.2 421.3C158.6 418.7 170.3 417.5 178.4 417.4C186.6 417.4 196.4 418.4 201.9 420.7C207.5 423.1 211.1 428.8 211.6 431.7C212 434.6 211.1 440 205.3 442.6C199.6 445.1 185.7 446.6 176.9 447C168 447.3 157.4 446.9 152.3 444.6C147.1 442.2 145.8 436.8 145.9 432.9Z"/>
</g>
<g id="char-leg-r" data-pivot="232 410">
<path class="f-pants line" d="M214 396C217.3 392.7 244.7 392.7 248 396C251.3 399.2 250.3 425.2 247 428.5C243.6 431.7 218.2 431.7 214.9 428.5C211.6 425.2 210.7 399.3 214 396Z"/>
<path class="f-shoe line" d="M201.8 433.3C202 429.3 203.7 423.8 209.1 421C214.5 418.3 226.1 417.2 234.2 417.1C242.2 417.1 252 418.2 257.6 420.8C263.2 423.3 267.2 429.3 267.7 432.3C268.1 435.3 266.8 440.5 261.1 443C255.4 445.5 242.2 446.9 233.3 447.2C224.5 447.6 213.2 447.6 208 445.3C202.7 443 201.6 437.4 201.8 433.3Z"/>
</g>
</g>
<g id="char-upper" data-pivot="202 404">
<g id="char-arm-l" data-pivot="120 318">
<path class="f-team line" d="M132.4 301.9C128.9 297.9 110.1 299.3 101.6 299.6C93.1 300 85.3 300.8 81.5 303.9C77.7 307 78.7 313.4 78.9 318.1C79 322.9 78.6 329.4 82.5 332.4C86.3 335.4 93.7 336.1 102 336.3C110.3 336.6 128.8 337.9 132.3 333.9C135.9 329.9 136 305.9 132.4 301.9Z"/>
<path class="f-team-dark line" d="M80.4 308.2C78.4 303.1 73.5 298.7 68.4 296.9C63.2 295.1 54.6 295.3 49.5 297.3C44.5 299.3 40.3 304.3 38.2 308.7C36.1 313.2 35.2 319.3 36.8 324.2C38.5 329.1 43.1 335.4 48.2 337.9C53.3 340.3 62.1 340.5 67.5 338.8C72.9 337.1 78.4 332.9 80.6 327.8C82.8 322.7 82.5 313.4 80.4 308.2Z"/>
<path class="f-team-dark line" d="M65.8 300.3C66.8 297.5 61.2 289.9 58.2 288C55.2 286.1 49.9 287.3 47.7 289.1C45.5 290.9 44.4 295.9 45.1 298.6C45.8 301.3 48.7 304.9 52.1 305.2C55.6 305.5 64.8 303.2 65.8 300.3Z"/>
<path class="line-thin" d="M54 312C52.3 312.3 45.7 313.7 44 314"/>
</g>
<g id="char-body" data-pivot="202 404">
<path class="f-team line" d="M118.3 270C127.6 258.2 145.9 262.4 159.5 260.3C173.2 258.2 186.6 257.3 200.1 257.4C213.6 257.4 226.8 258.7 240.4 260.7C254.1 262.7 272.8 257.9 282 269.3C291.3 280.7 291.9 309.1 295.7 329.2C299.4 349.3 305.1 380.7 304.4 389.8C303.7 398.9 302 404.3 289.9 406.9C277.8 409.5 230.6 411.9 200.6 411.8C170.7 411.7 122.4 409 110.2 406.5C98 403.9 96.7 398.6 95.9 389.8C95.1 381 99.9 350.8 103.6 330.8C107.3 310.8 108.9 281.8 118.3 270Z"/>
<path class="line-thin" d="M213.9 295.8C214.1 305.2 215 333.4 215 352.2C215 371.1 214 399.5 213.8 409"/>
<circle class="f-team-dark line-soft" cx="226" cy="322" r="5"/>
<circle class="f-team-dark line-soft" cx="226" cy="350" r="5"/>
<circle class="f-team-dark line-soft" cx="226" cy="378" r="5"/>
<path class="line-thin" d="M120 372C123.7 371.3 138.3 368.7 142 368"/>
<path class="line-thin" d="M262 368C265.7 368.7 280.3 371.3 284 372"/>
</g>
<g id="char-arm-r" data-pivot="280 318">
<path class="f-team line" d="M268.5 302.1C271.9 298.2 289.5 300.1 297.8 300.3C306 300.6 314.1 300.9 317.9 303.8C321.8 306.7 321 313.1 320.9 317.8C320.8 322.5 321.4 329 317.5 332.1C313.6 335.1 305.7 335.9 297.5 336.1C289.3 336.4 271.5 337.7 268.1 333.7C264.7 329.7 265 306 268.5 302.1Z"/>
<path class="f-team-dark line" d="M320.1 307.9C322.3 302.6 327.4 298.6 332.3 296.8C337.2 294.9 344.6 294.6 349.6 296.7C354.5 298.8 359.6 304.8 361.9 309.5C364.2 314.1 365 319.7 363.4 324.4C361.8 329.1 357.4 335.2 352.1 337.6C346.8 340 337.3 340.4 331.7 338.8C326.2 337.3 320.8 333.4 318.8 328.3C316.9 323.1 317.8 313.1 320.1 307.9Z"/>
<path class="f-team-dark line" d="M334.4 299.7C333.3 296.9 339 289.6 342 287.9C345 286.2 350.2 287.5 352.3 289.4C354.5 291.3 355.6 296.8 354.9 299.3C354.3 301.9 351.8 304.7 348.4 304.8C345 304.8 335.5 302.5 334.4 299.7Z"/>
<path class="line-thin" d="M346 312C347.7 312.3 354.3 313.7 356 314"/>
</g>
<g id="char-head" data-pivot="202 296">
<g class="gal-only">
<path class="f-hair-2 line" d="M29.7 302C31.3 307.6 38.1 311.7 45.5 314C52.9 316.4 64.8 317.4 73.9 316.2C83 314.9 92.9 310.9 100.3 306.6C107.6 302.3 110.4 294.1 118 290.1C125.7 286.1 132.5 287.2 146.2 282.5C160 277.7 182.2 261.5 200.4 261.5C218.7 261.4 241.2 277.5 255.6 282.2C270 286.8 278.2 285.8 286.6 289.4C295 293.1 298.1 300 306 304.2C314 308.3 325.3 313.2 334.2 314.4C343.1 315.6 353.5 313.9 359.5 311.5C365.5 309.1 369.5 305.2 370 299.9C370.5 294.7 366.1 267.4 365.5 248.5C364.9 229.6 367.7 206.4 366.4 186.3C365.2 166.2 363.4 145.9 358 127.9C352.6 110 346 92.5 333.9 78.5C321.8 64.6 307.9 52.4 285.6 44.2C263.3 36.1 228.1 30 200.2 29.6C172.3 29.2 140.3 34.1 118.2 41.9C96.1 49.7 80.9 62.4 67.8 76.4C54.7 90.3 45.9 107.1 39.7 125.6C33.5 144.2 32.8 167.5 30.6 187.8C28.3 208.2 26.2 228.8 26 247.8C25.9 266.8 28.1 296.5 29.7 302Z"/>
</g>
<g id="char-ears">
<path class="f-skin line" d="M70.1 191.1C69.3 194.5 67.8 198.3 65.8 200.4C63.8 202.5 60.6 203.8 58 203.8C55.4 203.8 52.3 202.5 50.3 200.5C48.3 198.4 46.8 194.8 46 191.4C45.2 188.1 44.8 183.8 45.5 180.4C46.3 177.1 48.3 173.4 50.3 171.3C52.3 169.2 54.9 168 57.5 167.9C60 167.9 63.6 169.1 65.8 171.1C67.9 173.2 69.8 176.8 70.5 180.2C71.2 183.5 70.9 187.8 70.1 191.1Z"/>
<path class="f-skin line" d="M352.5 186.3C351.9 189.4 350.4 193 348.7 194.9C347.1 196.9 344.6 198.1 342.4 198.1C340.2 198.1 337.4 196.7 335.6 194.9C333.7 193 331.9 190 331.2 187.1C330.6 184.2 330.9 180.5 331.6 177.5C332.2 174.6 333.4 171.2 335.2 169.3C336.9 167.4 339.7 166.3 341.9 166.2C344.2 166.1 346.9 166.9 348.7 168.6C350.4 170.4 351.6 173.5 352.2 176.5C352.9 179.4 353.1 183.3 352.5 186.3Z"/>
<g class="flush" opacity="0"><path class="f-flush line" d="M70.1 191.1C69.3 194.5 67.8 198.3 65.8 200.4C63.8 202.5 60.6 203.8 58 203.8C55.4 203.8 52.3 202.5 50.3 200.5C48.3 198.4 46.8 194.8 46 191.4C45.2 188.1 44.8 183.8 45.5 180.4C46.3 177.1 48.3 173.4 50.3 171.3C52.3 169.2 54.9 168 57.5 167.9C60 167.9 63.6 169.1 65.8 171.1C67.9 173.2 69.8 176.8 70.5 180.2C71.2 183.5 70.9 187.8 70.1 191.1Z"/><path class="f-flush line" d="M352.5 186.3C351.9 189.4 350.4 193 348.7 194.9C347.1 196.9 344.6 198.1 342.4 198.1C340.2 198.1 337.4 196.7 335.6 194.9C333.7 193 331.9 190 331.2 187.1C330.6 184.2 330.9 180.5 331.6 177.5C332.2 174.6 333.4 171.2 335.2 169.3C336.9 167.4 339.7 166.3 341.9 166.2C344.2 166.1 346.9 166.9 348.7 168.6C350.4 170.4 351.6 173.5 352.2 176.5C352.9 179.4 353.1 183.3 352.5 186.3Z"/></g>
</g>
<path class="f-skin line" d="M340.8 195.5C338.6 209.5 332.6 224.8 325 237C317.4 249.2 307.4 259.9 295.2 269C283.1 278 267.4 286.1 252.1 291.5C236.8 296.8 219.8 300.4 203.4 300.8C187.1 301.3 169.6 298.8 154.1 294.1C138.6 289.4 123.4 281.6 110.6 272.6C97.9 263.6 85.8 251.9 77.5 240.3C69.3 228.7 64.1 216.6 61.1 203.1C58.1 189.6 57.2 173 59.6 159.2C61.9 145.4 67.8 132.3 75.3 120.1C82.9 107.9 92.9 95.2 104.9 86.1C117 77 132.2 70.6 147.4 65.5C162.6 60.3 179.7 55.7 196.2 55.3C212.6 54.9 231 58.5 246.4 62.9C261.7 67.2 275.5 72.9 288.1 81.4C300.7 89.9 313.6 101.9 322 113.8C330.4 125.8 335.1 139.3 338.3 152.9C341.4 166.5 343 181.5 340.8 195.5Z"/>
<g id="char-flush" opacity="0"><path class="f-flush line" d="M340.8 195.5C338.6 209.5 332.6 224.8 325 237C317.4 249.2 307.4 259.9 295.2 269C283.1 278 267.4 286.1 252.1 291.5C236.8 296.8 219.8 300.4 203.4 300.8C187.1 301.3 169.6 298.8 154.1 294.1C138.6 289.4 123.4 281.6 110.6 272.6C97.9 263.6 85.8 251.9 77.5 240.3C69.3 228.7 64.1 216.6 61.1 203.1C58.1 189.6 57.2 173 59.6 159.2C61.9 145.4 67.8 132.3 75.3 120.1C82.9 107.9 92.9 95.2 104.9 86.1C117 77 132.2 70.6 147.4 65.5C162.6 60.3 179.7 55.7 196.2 55.3C212.6 54.9 231 58.5 246.4 62.9C261.7 67.2 275.5 72.9 288.1 81.4C300.7 89.9 313.6 101.9 322 113.8C330.4 125.8 335.1 139.3 338.3 152.9C341.4 166.5 343 181.5 340.8 195.5Z"/></g>
<g id="char-veins">
<g class="vein" data-pivot="116 144"><path class="f-vein line-soft" d="M110.4 146.7C109.5 147.9 111.3 147.8 111.9 148.5C112.5 149.1 113.3 150 113.9 150.8C114.5 151.5 115.2 152.5 115.5 153C115.9 153.5 116 153.6 116.1 153.9C116.1 154.2 116.1 154.1 115.8 154.6C115.5 155 114.8 155.8 114.2 156.7C113.6 157.6 112.5 158.5 112 159.7C111.4 160.9 110.7 162.5 110.7 163.9C110.7 165.3 111.3 166.8 111.9 168.1C112.5 169.3 113.4 170.4 114.1 171.4C114.9 172.4 115.7 173.3 116.3 174C117 174.7 116.8 175.9 117.8 175.7C118.8 175.4 121.7 173.2 122.2 172.3C122.7 171.5 121.4 171.2 120.9 170.4C120.4 169.7 119.7 168.7 119.1 167.9C118.6 167 118 166 117.7 165.4C117.4 164.8 117.3 164.4 117.3 164.1C117.4 163.7 117.5 163.8 117.9 163.3C118.3 162.8 119.1 162.1 119.8 161.3C120.5 160.5 121.6 159.6 122.3 158.4C123 157.2 123.8 155.6 123.9 154.1C124 152.6 123.4 150.9 122.9 149.5C122.4 148.2 121.5 147 120.8 146C120.1 144.9 119.3 143.9 118.8 143.1C118.3 142.4 119 140.7 117.6 141.3C116.2 141.9 111.4 145.5 110.4 146.7Z"/></g>
<g class="vein" data-pivot="297 138"><path class="f-vein line-soft" d="M294.7 135.7C293.4 135.3 294 136.9 293.5 137.8C293 138.6 292.2 139.7 291.6 140.9C290.9 142 290.1 143.3 289.6 144.6C289.2 146 288.7 147.6 288.8 149C288.8 150.4 289.4 151.9 290 153.2C290.6 154.5 291.5 155.7 292.2 156.7C292.9 157.8 293.8 158.8 294.4 159.6C295.1 160.3 295 161.6 295.9 161.4C296.9 161.3 299.6 159.4 300.1 158.6C300.5 157.8 299.3 157.3 298.8 156.5C298.3 155.7 297.6 154.6 297 153.6C296.5 152.7 295.9 151.6 295.6 150.8C295.3 150 295.2 149.6 295.2 149C295.3 148.4 295.6 148 296 147.3C296.4 146.6 297 145.6 297.7 144.8C298.3 143.9 299.2 142.9 299.8 142.2C300.4 141.4 302.1 141.3 301.3 140.3C300.5 139.2 296 136.1 294.7 135.7Z"/></g>
</g>
<g class="gal-only">
<g id="char-lock-l" class="flop" data-pivot="74 128" data-flop="lock">
<path class="f-hair line" d="M95.4 103.5C100.4 111.6 104.3 130.9 106.1 146.3C107.9 161.7 106.9 179.2 106.2 195.9C105.5 212.6 101.3 230.7 102 246.3C102.7 261.9 110.2 283.7 110.4 289.5C110.6 295.2 106.5 302.1 104.2 304C101.8 305.9 90.3 310.4 82.2 312.1C74.1 313.8 63.6 315.6 55.6 314.2C47.6 312.8 36.5 308.4 34.3 303.6C32.2 298.8 30 273.8 29.6 256.5C29.3 239.3 30.3 218.2 32.2 200.1C34 182 36.5 162.9 40.6 148.1C44.7 133.3 50.7 119.8 56.6 111.4C62.5 103.1 69.6 99.3 76.1 98C82.6 96.7 90.4 95.5 95.4 103.5Z"/>
<path class="line-thin" d="M60 150C59 160.7 54.3 191.7 54 214C53.7 236.3 57.3 272.3 58 284"/>
<path class="line-thin" d="M86 164C85.7 175.3 83.3 210.3 84 232C84.7 253.7 89 283.7 90 294"/>
</g>
<g id="char-lock-r" class="flop" data-pivot="326 124" data-flop="lock">
<path class="f-hair line" d="M303.5 99.7C307.3 91.1 319.1 94.7 326.3 96.4C333.4 98 340.8 101.3 346.4 109.6C351.9 117.9 356.4 131.2 359.6 146C362.9 160.8 364.7 180.8 365.8 198.5C366.9 216.2 365.5 235.7 366.1 252.4C366.7 269 370.8 293.6 369.5 298.5C368.2 303.5 357.6 309.4 350.3 311.6C343.1 313.8 332.3 313.3 326 311.8C319.6 310.2 313 304.1 312.4 302.1C311.7 300.2 317.8 294 318.2 288.4C318.6 282.8 317.5 261.7 316.2 246.3C314.9 230.9 312.5 212.2 310.4 195.9C308.3 179.5 304.7 164.1 303.5 148.1C302.4 132.1 299.7 108.3 303.5 99.7Z"/>
<path class="line-thin" d="M334 152C335.3 163.7 340.3 198.7 342 222C343.7 245.3 343.7 280.3 344 292"/>
</g>
<g class="hair-top" data-pivot="200 140">
<path class="f-hair line" d="M36.3 150.4C35.7 145.8 35.8 124.4 39.6 111.8C43.5 99.1 49.3 85.6 59.4 74.6C69.6 63.6 85.3 53.1 100.5 46C115.6 38.9 133.7 35.2 150.4 32.2C167 29.3 183.3 28.3 200.2 28.3C217.1 28.3 234.8 29.2 251.8 32.1C268.7 35.1 287 38.9 301.7 45.9C316.4 52.9 329.9 63.1 339.8 74.1C349.8 85.1 356.8 99.3 361.6 112C366.3 124.7 369.5 146.5 368.2 150.5C366.8 154.5 354.1 154.2 347.7 152.2C341.4 150.2 335.6 142.5 329.9 138.5C324.1 134.5 319.1 129.2 313.5 128.3C307.8 127.5 299 133.8 295.9 133.5C292.8 133.2 282.4 124.6 275.8 124.9C269.1 125.3 259.3 135.5 256 135.6C252.7 135.7 242.4 125.9 235.7 126.2C229.1 126.5 219.5 137.1 216.1 137.3C212.8 137.4 202.3 127.9 195.6 128.1C188.9 128.2 179.3 138.2 176 138.3C172.6 138.4 162.2 129.4 155.6 129.4C149.1 129.5 139.9 138.4 136.6 138.5C133.3 138.7 122.5 130.3 116.2 131.1C109.8 132 102.3 141.5 98.6 143.6C94.9 145.7 80.5 153.6 71.8 156.1C63 158.5 51.9 159.2 46 158.3C40.1 157.3 36.9 155.1 36.3 150.4Z"/>
<path class="line-thin" d="M120 60C117.3 66 107.3 84.7 104 96C100.7 107.3 100.7 122.7 100 128"/>
<path class="line-thin" d="M196 44C194.3 51.3 188 74.7 186 88C184 101.3 184.3 118 184 124"/>
<path class="line-thin" d="M262 46C263.3 53 268.3 75.7 270 88C271.7 100.3 271.7 114.7 272 120"/>
<path class="line-thin" d="M318 70C321.3 75.7 333.7 92.3 338 104C342.3 115.7 343 134 344 140"/>
</g>
</g>
<g class="guy-only">
<g id="char-tuft" class="flop" data-pivot="226 34" data-flop="tuft">
<path class="f-hair line" d="M206.3 36C199.9 32.4 205 19.8 207.6 14.2C210.3 8.6 220.8 1.9 222.1 2.3C223.5 2.7 224.2 19.4 228.2 19.7C232.3 20 245.1 3.7 246.4 3.8C247.7 4 248.3 16.5 248.3 21.8C248.2 27.1 253.1 33.3 246.1 35.6C239.1 38 212.7 39.6 206.3 36Z"/>
</g>
<g class="hair-top" data-pivot="200 140">
<path class="f-hair line" d="M64.4 175.8C62.3 173.3 58.4 153.7 56.1 142.4C53.7 131.1 49.3 119.3 50.2 108C51.2 96.6 54.2 84.7 61.9 74.4C69.7 64.1 82.5 53.9 96.5 46.2C110.5 38.6 128.7 32.4 145.9 28.6C163 24.8 181 23.5 199.4 23.3C217.9 23.1 238.8 24 256.6 27.4C274.4 30.7 292.1 36.1 306.1 43.4C320.1 50.8 332.1 60.8 340.4 71.6C348.8 82.4 353.9 96.4 356.2 108.2C358.6 119.9 356.8 131.6 354.6 142.2C352.3 152.7 344.9 169.2 342.5 171.4C340.2 173.6 328 171 326.1 168.4C324.2 165.7 322.8 147 319.4 139.6C316 132.1 309 124.3 305.7 123.7C302.4 123 300.7 136.4 299.5 135.8C298.4 135.2 286.6 112.6 281.8 112C276.9 111.5 272.1 132.5 270.6 132.4C269 132.3 255.7 110.7 250.2 110.3C244.7 110 239.3 130.4 237.6 130.2C235.9 130.1 221.8 108.5 216.3 108C210.8 107.6 206.1 127.5 204.5 127.5C202.9 127.5 190.3 108.6 184.5 108.3C178.7 108 171.4 125.8 169.7 125.8C167.9 125.8 155.3 108.7 149.6 108.4C144 108.1 137.4 124.2 135.7 124.1C134.1 124 122 106.8 116.5 106.5C111 106.2 103.8 122 102.5 122.5C101.1 122.9 92.6 112.6 89.5 115.9C86.5 119.2 85.9 132.8 84.4 142.2C82.9 151.7 82.2 169.5 80.5 172.3C78.8 175.1 66.4 178.3 64.4 175.8Z"/>
<path class="f-hair-2" d="M112.2 69.7C117.8 64.4 139.1 53.2 155.8 48.2C172.5 43.2 209.9 38.4 212.3 39.8C214.6 41.1 185 49.5 170 56.2C155 62.9 131.8 77.7 122.1 80C112.5 82.3 106.6 75 112.2 69.7Z"/>
<path class="f-hair-2" d="M253.9 43.9C260.9 44.5 288 51.2 300 58C312 64.7 326.2 82.3 325.8 84.3C325.4 86.3 309.1 75 297.8 70C286.5 65 265.4 58.6 258.1 54.3C250.8 49.9 246.9 43.2 253.9 43.9Z"/>
</g>
</g>
<g id="char-face">
<g id="char-eyes" data-pivot="222 174">
<path class="f-paper line" d="M220.7 184C219.1 189.2 215.7 194.9 212.2 198.5C208.6 202.2 204 204.9 199.5 206.1C194.9 207.3 189.4 207.5 185.1 205.8C180.8 204 176.5 199.9 173.7 195.8C170.9 191.7 169 186.5 168.4 181.2C167.7 175.9 168.1 169.5 169.8 164.2C171.4 158.9 174.7 153.3 178.2 149.5C181.6 145.7 186.1 142.5 190.5 141.4C194.9 140.3 200.3 141.3 204.6 143C208.9 144.8 213.3 148 216.1 152.1C219 156.2 221 162.3 221.8 167.6C222.5 172.9 222.3 178.9 220.7 184Z"/>
<path class="f-paper line" d="M275.8 176.9C275.5 182.4 274.1 188.1 271.7 192.6C269.4 197.1 265.6 201.3 261.7 203.6C257.7 206 252.7 207.3 248.1 206.8C243.6 206.3 238.3 203.8 234.5 200.6C230.7 197.5 227.3 192.8 225.2 187.9C223.2 183 222.1 176.6 222.3 171.1C222.4 165.6 223.7 159.4 226 155C228.4 150.5 232.5 146.5 236.4 144.2C240.3 142 244.9 141.1 249.5 141.5C254 141.9 259.6 143.6 263.6 146.7C267.5 149.7 271.2 154.8 273.3 159.8C275.3 164.9 276 171.4 275.8 176.9Z"/>
<g class="gal-only"><path class="line-lash" d="M172.8 159.9C170.6 158.9 161.8 154.9 159.6 153.9"/><path class="line-lash" d="M179.3 150.4C177.5 148.7 170.6 141.9 168.9 140.2"/><path class="line-lash" d="M188 144.4C187.1 142.1 183.3 133.2 182.4 131"/><path class="line-lash" d="M256 144.4C256.9 142.1 260.7 133.2 261.6 131"/><path class="line-lash" d="M264.7 150.4C266.5 148.7 273.4 141.9 275.1 140.2"/><path class="line-lash" d="M271.2 159.9C273.4 158.9 282.2 154.9 284.4 153.9"/></g>
<g id="char-pupils"><circle class="f-ink" cx="204" cy="180" r="5.8"/><circle class="f-ink" cx="258" cy="180" r="5.8"/></g>
</g>
<g id="char-glasses" class="guy-only">
<circle class="f-lens" cx="194" cy="174" r="35"/><circle class="f-lens" cx="250" cy="174" r="35"/>
<path class="line-frame" d="M160 178C154.7 178.3 138.3 179 128 180C117.7 181 103 183.3 98 184"/>
<path class="line-frame" d="M284 178C287.3 178 297.7 178.3 304 178C310.3 177.7 319 176.3 322 176"/>
<circle class="line-frame" cx="194" cy="174" r="35"/><circle class="line-frame" cx="250" cy="174" r="35"/>
</g>
<g id="char-brows">
<g id="char-brow-l" data-pivot="192 146"><path class="f-ink" d="M164.7 131C167.3 130.3 183.2 133.7 192.1 136C201.1 138.4 216.1 142.8 218.6 144.9C221.1 147 219.7 156.3 217 156.6C214.2 156.9 199.5 150.1 191.1 147.9C182.8 145.6 169.6 144.9 166.9 143.2C164.3 141.5 162.2 131.8 164.7 131Z"/></g>
<g id="char-brow-r" data-pivot="256 149"><path class="f-ink" d="M227.1 152.4C229.8 150.1 247 145.5 256.2 142C265.5 138.6 279.9 131.4 282.8 131.7C285.6 132 287.2 142.9 284.6 145.1C282 147.3 266.1 150.4 256.8 153.7C247.5 157 231.8 165 228.8 164.9C225.9 164.8 224.4 154.7 227.1 152.4Z"/></g>
</g>
<g id="char-mouth" data-pivot="224 224">
<clipPath id="char-mouth-clip"><use href="#char-mouth-cavity"/></clipPath>
<path id="char-mouth-cavity" class="f-mouth" d="M162 234C163.5 231.8 175.7 228 186 226C196.3 224 211.3 222.2 224 222C236.7 221.8 251.7 223.3 262 225C272.3 226.7 284.5 229.8 286 232C287.5 234.2 284.8 246.5 282 254C279.2 261.5 274.7 270.7 269 277C263.3 283.3 255.5 288.8 248 292C240.5 295.2 232 296 224 296C216 296 207.5 295.2 200 292C192.5 288.8 184.7 283.2 179 277C173.3 270.8 168.8 262.2 166 255C163.2 247.8 160.5 236.2 162 234Z"/>
<g clip-path="url(#char-mouth-clip)">
<g id="char-jaw">
<path class="f-tongue line" d="M256.7 288.1C256.6 290.7 254.4 293.5 250.9 295.6C247.4 297.7 241.4 299.9 235.7 300.6C230 301.4 222.3 301.2 216.6 300.3C210.8 299.4 204.8 297.3 201.2 295.4C197.6 293.4 195.1 290.9 195 288.4C194.9 285.8 197.3 282.3 200.8 280.2C204.4 278.1 210.6 276.6 216.4 275.8C222.2 275 229.7 274.7 235.5 275.4C241.3 276.1 247.9 278 251.4 280.2C255 282.3 256.7 285.5 256.7 288.1Z"/>
<path class="line-thin" d="M226 279C226.2 281.7 226.8 292.3 227 295"/>
</g>
<path class="f-paper line" d="M156.1 222.3C161.8 217.8 180.6 216.9 191.9 215.2C203.3 213.5 213.1 212.2 224.1 212C235.1 211.8 246.6 212.3 258 213.7C269.3 215.2 286.8 216.5 292.1 220.7C297.5 224.9 295.9 236.8 290.2 239C284.6 241.1 269.1 234.8 258.1 233.9C247 232.9 234.9 233.1 224 233.3C213 233.5 203.2 233.7 192.3 235.1C181.3 236.5 164.2 244 158.1 241.9C152.1 239.8 150.5 226.7 156.1 222.3Z"/>
<path class="line-thin" d="M190 217C190 220.1 190 232.3 190 235.4"/>
<path class="line-thin" d="M212 217C212 219.8 212 231 212 233.8"/>
<path class="line-thin" d="M236 217C236 219.7 236 230.6 236 233.4"/>
<path class="line-thin" d="M258 217C258 219.8 258 231.2 258 234"/>
</g>
<path id="char-mouth-line" class="line f-none" d="M162 234C163.5 231.8 175.7 228 186 226C196.3 224 211.3 222.2 224 222C236.7 221.8 251.7 223.3 262 225C272.3 226.7 284.5 229.8 286 232C287.5 234.2 284.8 246.5 282 254C279.2 261.5 274.7 270.7 269 277C263.3 283.3 255.5 288.8 248 292C240.5 295.2 232 296 224 296C216 296 207.5 295.2 200 292C192.5 288.8 184.7 283.2 179 277C173.3 270.8 168.8 262.2 166 255C163.2 247.8 160.5 236.2 162 234Z"/>
</g>
<g id="char-spit"><g class="spit"><path class="f-paper line-soft" d="M4.7 0.1C4.7 1.2 3.8 2.7 2.6 3.3C1.4 3.9 -1.3 4.3 -2.6 3.7C-3.8 3.1 -5 1 -4.9 -0.2C-4.9 -1.4 -3.6 -3.1 -2.4 -3.6C-1.1 -4.2 1.4 -4.1 2.6 -3.5C3.8 -2.9 4.7 -1 4.7 0.1Z"/></g><g class="spit"><path class="f-paper line-soft" d="M3.8 -0.1C3.7 0.8 2.9 2.5 2 3C1.1 3.4 -0.7 2.9 -1.7 2.5C-2.7 2 -4 1.1 -4 0.3C-4 -0.6 -2.9 -2.2 -1.9 -2.6C-0.8 -3.1 1.3 -2.9 2.2 -2.5C3.1 -2.1 3.8 -1 3.8 -0.1Z"/></g><g class="spit"><path class="f-paper line-soft" d="M5.8 0.1C5.8 1.5 4.5 3.4 3 4C1.5 4.7 -1.7 4.6 -3.2 3.9C-4.7 3.3 -6.2 1.4 -6.1 0.1C-6 -1.3 -4.3 -3.6 -2.8 -4.4C-1.3 -5.1 1.6 -5.1 3.1 -4.3C4.5 -3.6 5.8 -1.3 5.8 0.1Z"/></g><g class="spit"><path class="f-paper line-soft" d="M3.5 0.2C3.4 1 2.4 2.2 1.5 2.6C0.6 3 -1 3.1 -1.8 2.6C-2.6 2.2 -3.4 0.7 -3.5 -0.1C-3.5 -1 -2.8 -1.9 -1.9 -2.3C-1 -2.7 1.1 -3 2 -2.6C2.9 -2.1 3.6 -0.7 3.5 0.2Z"/></g></g>
</g>
<g id="char-hat" data-pivot="200 120">
<g class="hat hat-beanie">
<path class="f-team line" d="M56.6 104.5C51.6 101.5 55.1 84.5 59.8 75.2C64.5 66 72.9 56.4 84.7 48.9C96.5 41.4 111.3 34.5 130.6 30.2C149.8 26 176.8 23.5 200.2 23.5C223.6 23.4 251.5 26 270.8 29.9C290.1 33.9 304.4 39.5 316 47.1C327.5 54.8 335.3 66.8 340.1 75.9C344.9 85 349.7 98.9 344.8 101.9C339.9 105 315.1 104.9 290.9 106.4C266.6 107.8 229.2 110.9 199 110.7C168.9 110.5 133.7 106.1 110 105C86.2 104 61.6 107.5 56.6 104.5Z"/>
<path class="line-thin" d="M150 38C151.7 43.3 159 60 160 70C161 80 156.7 93.3 156 98"/>
<path class="line-thin" d="M254 38C253.3 43.3 250 60 250 70C250 80 253.3 93.3 254 98"/>
<path class="f-team-dark line" d="M58.1 93.7C62.6 92.4 86.6 99.5 110.3 101.9C133.9 104.3 170 107.6 199.9 107.9C229.8 108.2 265.9 106.3 289.7 103.7C313.5 101 337.9 90.9 342.4 92C346.9 93 347.9 112.9 343.6 115.9C339.2 118.9 314 125.4 290.2 128C266.3 130.7 230.5 132.1 200.5 131.7C170.5 131.3 134.5 127.9 110.4 125.5C86.3 123.2 60.4 120.2 56 117.5C51.7 114.8 53.6 95 58.1 93.7Z"/>
<path class="line-thin" d="M74 101.5C74.2 103.8 74.8 113.3 75 115.7"/>
<path class="line-thin" d="M94 104.5C94.2 106.9 94.8 116.3 95 118.6"/>
<path class="line-thin" d="M114 107.3C114.2 109.6 114.8 118.9 115 121.3"/>
<path class="line-thin" d="M134 108.6C134.2 110.9 134.8 120.3 135 122.6"/>
<path class="line-thin" d="M154 109.9C154.2 112.3 154.8 121.6 155 123.9"/>
<path class="line-thin" d="M174 111.3C174.2 113.6 174.8 122.9 175 125.3"/>
<path class="line-thin" d="M194 112.6C194.2 114.9 194.8 124.3 195 126.6"/>
<path class="line-thin" d="M214 112.4C214.2 114.7 214.8 124 215 126.4"/>
<path class="line-thin" d="M234 111.5C234.2 113.8 234.8 123.2 235 125.5"/>
<path class="line-thin" d="M254 110.6C254.2 112.9 254.8 122.3 255 124.6"/>
<path class="line-thin" d="M274 109.7C274.2 112 274.8 121.4 275 123.7"/>
<path class="line-thin" d="M294 108.1C294.2 110.4 294.8 119.8 295 122.1"/>
<path class="line-thin" d="M314 103.5C314.2 105.8 314.8 115.3 315 117.7"/>
<path class="line-thin" d="M334 98.8C334.2 101.2 334.8 110.8 335 113.2"/>
<g id="char-pom" class="flop" data-pivot="208 40" data-flop="pom">
<path class="f-paper line" d="M231.6 29.4C230.2 32.5 233.2 37.3 231.3 39.3C229.4 41.2 223.8 39.7 220.4 41C217.1 42.4 214.3 46.8 211.2 47.5C208.1 48.2 205 46.3 201.9 45.4C198.8 44.4 195.5 43.3 192.5 41.8C189.6 40.3 185.9 39.1 184.2 36.6C182.5 34.1 183.9 29.6 182.6 26.6C181.3 23.6 176.2 21.2 176.4 18.5C176.7 15.8 182.9 13.3 184.3 10.3C185.7 7.3 182.9 2.3 184.9 0.5C187 -1.3 193.2 0.5 196.4 -0.7C199.5 -1.9 200.7 -6.2 203.8 -6.9C206.8 -7.6 211.2 -6 214.6 -5C218 -4.1 221.2 -2.8 224.1 -1.4C227 0 230.6 1.1 232.2 3.5C233.8 5.8 232.3 10 233.6 12.9C234.9 15.8 240.3 18.3 240 21C239.7 23.8 233.1 26.4 231.6 29.4Z"/>
<path class="line-thin" d="M194 10C195.5 11.2 201.5 15.8 203 17"/>
<path class="line-thin" d="M216 6C216.5 7.8 218.5 15.2 219 17"/>
<path class="line-thin" d="M197 30C199 29.8 207 29.2 209 29"/>
<path class="line-thin" d="M222 26C223 25 227 21 228 20"/>
</g>
</g>
<g class="hat hat-cap">
<path class="f-team line" d="M55.9 113.2C50.7 108.4 53.9 90.1 57.8 78.7C61.8 67.4 67.9 54.4 79.7 45.2C91.4 36 108.1 28.3 128.2 23.6C148.2 18.8 175.8 17 199.9 16.8C224.1 16.6 253.2 18.1 272.9 22.5C292.7 26.9 306.9 34.2 318.5 43.2C330.2 52.2 338.7 65.1 342.8 76.7C346.9 88.2 348.3 107.6 343.1 112.7C337.9 117.8 314.5 124.5 290.6 127.7C266.7 130.8 230.1 131.7 199.9 131.6C169.8 131.5 133.8 130 109.8 126.9C85.8 123.9 61.1 118.1 55.9 113.2Z"/>
<path class="line-thin" d="M200 20C192 27.3 161 46.7 152 64C143 81.3 147 114 146 124"/>
<path class="line-thin" d="M200 20C208.3 27.3 240.7 46.3 250 64C259.3 81.7 255 115.7 256 126"/>
<path class="f-team-dark line" d="M55.7 106C60.2 105.8 85.7 113.2 109.8 115.9C133.9 118.6 170.1 121.8 200.2 122.2C230.3 122.5 266.2 121 290.2 118C314.2 115 339.7 104.5 344.2 104.3C348.7 104.1 353.1 111.8 344 115.8C335 119.8 313.7 125.6 289.7 128.3C265.8 130.9 230.2 132.1 200.3 131.7C170.3 131.3 134 128.3 110 126C85.9 123.7 64.9 121.1 55.9 117.8C46.8 114.4 51.2 106.2 55.7 106Z"/>
<circle class="f-team-dark line" cx="200" cy="16" r="8"/>
<g id="char-brim" class="flop" data-pivot="267 112" data-flop="brim">
<path class="f-team-dark line" d="M263.7 112C266.6 111.7 286.1 118.6 299.9 120.4C313.7 122.1 332.9 122.9 346.5 122.4C360 121.9 375.3 116.7 381.4 117.6C387.4 118.5 384.1 125.9 382.9 127.7C381.7 129.5 378.1 134 369.2 135.7C360.3 137.5 342 138.9 329.3 138.2C316.5 137.5 303.6 133.9 292.8 131.6C282.1 129.2 267.5 125.8 265.1 124.1C262.6 122.5 260.8 112.3 263.7 112Z"/>
<path class="f-team line" d="M261.6 104.1C264.1 102.3 283.4 98.8 295.2 96.4C307.1 94 320.6 90.2 332.5 89.8C344.4 89.4 358.3 91.3 366.8 93.9C375.3 96.5 382 102.9 383.5 105.5C385 108.1 385.1 118.2 381.4 120.1C377.6 121.9 359.8 123.6 346.3 123.9C332.8 124.2 314 122.9 300.5 122C286.9 121.1 268.2 119.8 264.9 118.3C261.7 116.8 259.1 105.9 261.6 104.1Z"/>
<path class="line-thin" d="M272 110C279.2 109.2 299.2 105.7 315 105C330.8 104.3 358.3 105.8 367 106"/>
</g>
</g>
</g>
<g id="char-steam">
<g class="steam steam-l" opacity="0"><path class="f-paper line" d="M13.8 -0.4C13.8 1 11.1 2.8 10 4.1C9 5.5 8.5 6.4 7.4 7.6C6.2 8.9 4.8 11.6 3.2 11.7C1.5 11.8 -0.8 9 -2.5 8.4C-4.3 7.7 -5.8 8.5 -7.3 7.8C-8.8 7.2 -11 5.7 -11.5 4.3C-12.1 3 -10.6 1 -10.6 -0.4C-10.6 -1.9 -12.1 -3.1 -11.6 -4.4C-11.1 -5.7 -9.2 -7.6 -7.6 -8.3C-5.9 -9 -3.6 -8.3 -1.9 -8.8C-0.2 -9.3 1.1 -11.4 2.7 -11.2C4.3 -11.1 6.5 -9.1 7.7 -7.9C8.9 -6.8 8.8 -5.4 9.8 -4.1C10.8 -2.8 13.8 -1.7 13.8 -0.4Z"/></g>
<g class="steam steam-l" opacity="0"><path class="f-paper line" d="M9 12.1C7.3 13.5 4.2 14.5 1.9 14.3C-0.4 14.1 -2.5 11.6 -4.7 10.9C-7 10.3 -10 11.4 -11.8 10.4C-13.5 9.3 -14.9 6.7 -15.3 4.8C-15.7 2.8 -14.1 0.8 -14.1 -1.4C-14 -3.7 -16.1 -6.9 -15.1 -8.6C-14.1 -10.2 -10.4 -10.6 -8.2 -11.2C-5.9 -11.8 -4 -11.6 -1.6 -12.2C0.7 -12.7 4 -15 5.9 -14.5C7.9 -14 8.7 -10.7 10.1 -9.1C11.5 -7.4 13 -6.4 14.2 -4.7C15.5 -3 18 -0.6 17.7 1.2C17.4 3 13.8 4.5 12.4 6.3C10.9 8.1 10.8 10.8 9 12.1Z"/></g>
<g class="steam steam-l" opacity="0"><path class="f-paper line" d="M-7.8 13.8C-10.8 13 -15.9 13.8 -17.7 12.3C-19.5 10.7 -18.5 7.1 -18.6 4.4C-18.6 1.8 -18 -0.7 -17.9 -3.4C-17.9 -6.1 -19.8 -10.1 -18.2 -11.7C-16.7 -13.4 -11.6 -12.5 -8.6 -13.5C-5.7 -14.4 -3.5 -16.7 -0.5 -17.4C2.6 -18.1 7.1 -19 9.5 -17.7C11.9 -16.4 12 -11.8 13.9 -9.6C15.8 -7.5 19.5 -7 20.7 -4.7C21.9 -2.5 22.4 1.4 21.3 3.8C20.1 6.2 15.8 7.4 13.8 9.6C11.9 11.8 11.8 15.8 9.6 17.1C7.4 18.4 3.4 17.9 0.6 17.4C-2.3 16.8 -4.7 14.7 -7.8 13.8Z"/></g>
<g class="steam steam-r" opacity="0"><path class="f-paper line" d="M13.8 -0.4C13.8 0.9 11 2.5 10 3.8C8.9 5.1 8.5 6.2 7.4 7.4C6.3 8.5 4.9 10.7 3.2 10.9C1.5 11.2 -0.9 9.4 -2.8 8.9C-4.6 8.4 -6.4 8.7 -7.9 8C-9.4 7.3 -11.4 5.8 -11.8 4.5C-12.2 3.1 -10.2 1.5 -10.3 -0.1C-10.3 -1.6 -12.6 -3.4 -12.2 -4.7C-11.7 -6.1 -9.1 -7.5 -7.5 -8.2C-5.8 -8.9 -3.9 -8.4 -2.2 -9C-0.6 -9.5 1 -11.6 2.5 -11.4C4.1 -11.2 5.9 -9 7.1 -7.7C8.3 -6.5 8.5 -5.1 9.6 -3.8C10.8 -2.6 13.7 -1.6 13.8 -0.4Z"/></g>
<g class="steam steam-r" opacity="0"><path class="f-paper line" d="M8.5 12.2C6.8 13.6 3.9 15.2 1.8 15C-0.3 14.8 -1.8 11.9 -4.1 11.1C-6.5 10.4 -10.4 11.3 -12.3 10.3C-14.2 9.3 -15.2 7.2 -15.4 5.2C-15.6 3.3 -13.9 0.8 -13.8 -1.5C-13.7 -3.8 -16 -6.8 -15.1 -8.4C-14.2 -10 -10.5 -10.2 -8.4 -10.9C-6.2 -11.6 -4.5 -11.8 -2.1 -12.5C0.3 -13.2 4 -15.7 6 -15.1C8 -14.5 8.4 -10.5 9.9 -8.8C11.4 -7 13.9 -6.4 15.1 -4.7C16.4 -2.9 17.9 -0.3 17.5 1.5C17 3.4 13.8 4.9 12.3 6.7C10.8 8.5 10.3 10.8 8.5 12.2Z"/></g>
<g class="steam steam-r" opacity="0"><path class="f-paper line" d="M-7.9 13.7C-10.9 12.8 -15.9 13.8 -17.7 12.2C-19.5 10.7 -18.5 6.9 -18.5 4.4C-18.6 1.8 -18.3 -0.4 -18.2 -3C-18.1 -5.6 -19.4 -9.6 -17.8 -11.4C-16.1 -13.2 -11.1 -13 -8.2 -13.9C-5.4 -14.9 -3.6 -16.7 -0.6 -17.2C2.3 -17.7 7 -18.3 9.3 -17.1C11.7 -15.9 11.6 -12.2 13.4 -10C15.2 -7.8 19.1 -6.4 20.3 -4.1C21.4 -1.8 21.6 1.6 20.6 3.8C19.5 6 15.6 7.1 13.8 9.1C11.9 11.2 11.6 15 9.4 16.3C7.2 17.7 3.3 17.8 0.4 17.4C-2.5 16.9 -4.8 14.6 -7.9 13.7Z"/></g>
</g>
</g>
</g>
</g>
</svg>
`;
  /* RIG MARKUP:END */

  /* Paint for the rig. Colours come from the tokens on :root (css/style.css);
     the export below inlines their current values. */
  const RIG_CSS = `
.rig{overflow:visible;--ow:3.5px}
.rig .line{stroke:var(--ink);stroke-width:var(--ow);vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.rig .line-thin{fill:none;stroke:var(--ink);stroke-width:calc(var(--ow) * .6);vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.rig .line-soft{stroke:var(--ink);stroke-width:calc(var(--ow) * .6);vector-effect:non-scaling-stroke;stroke-linejoin:round}
.rig .line-lash{fill:none;stroke:var(--ink);stroke-width:calc(var(--ow) * .85);vector-effect:non-scaling-stroke;stroke-linecap:round}
.rig .f-none{fill:none}
.rig .f-ink{fill:var(--ink)}
.rig .f-paper{fill:var(--paper)}
.rig .f-skin{fill:var(--skin)}
.rig .f-flush{fill:var(--flush)}
.rig .f-vein{fill:var(--vein)}
.rig .f-mouth{fill:var(--mouth)}
.rig .f-tongue{fill:var(--tongue)}
.rig .f-pants{fill:var(--pants)}
.rig .f-shoe{fill:var(--shoe)}
.rig .f-hair{fill:var(--hair)}
.rig .f-hair-2{fill:var(--hair-2)}
.rig .f-lens{fill:var(--paper);opacity:.22}
.rig .line-frame{fill:none;stroke:var(--ink);stroke-width:calc(var(--ow) * 1.5);vector-effect:non-scaling-stroke;stroke-linecap:round;stroke-linejoin:round}
.rig .f-team{fill:var(--team)}
.rig .f-team-dark{fill:var(--team-dark)}
.rig .f-shadow{fill:var(--ink);opacity:.2}
.rig[data-team="left"]{--team:var(--red);--team-dark:var(--red-dark)}
.rig[data-team="right"]{--team:var(--blue);--team-dark:var(--blue-dark)}
.rig[data-variant="gal"]{--hair:var(--hair-blonde);--hair-2:var(--hair-blonde-2)}
.rig[data-variant="guy"]{--hair:var(--hair-black);--hair-2:var(--hair-black-2)}
.rig[data-variant="guy"] .gal-only,.rig[data-variant="gal"] .guy-only{display:none}
.rig .hat{display:none}
.rig[data-hat="beanie"] .hat-beanie,.rig[data-hat="cap"] .hat-cap{display:inline}
`;

  /* Tokens the rig paints with; inlined when exporting a standalone SVG. */
  const TOKENS = ['ink', 'paper', 'skin', 'flush', 'vein', 'mouth', 'tongue', 'pants', 'shoe',
    'hair-blonde', 'hair-blonde-2', 'hair-black', 'hair-black-2',
    'red', 'red-dark', 'blue', 'blue-dark'];

  /* The two fighters. `variant` picks the look: "gal" is the blonde bob,
     "guy" the black hair and glasses; swap them to swap sides. `hat` can be
     "beanie" or "cap" (or null for none). Everything else is identical. */
  const TEAMS = {
    left: { id: 'left', name: 'LEFTY', side: 'LEFT', facing: 1, variant: 'gal', hat: null },
    right: { id: 'right', name: 'RIGHTY', side: 'RIGHT', facing: -1, variant: 'guy', hat: null },
  };

  /* Every animatable channel with its neutral value. Units: px / degrees in
     viewBox space; 0–1 for the normalised ones. "Forward" is always toward
     the opponent, whichever way the character faces on screen. */
  const BASE = Object.freeze({
    x: 0, y: 0, rot: 0, sx: 1, sy: 1, // whole character (feet stay the anchor)
    lean: 5, bodySY: 1,               // upper body lean (deg, + = forward) and squash
    legL: 0, legR: 0,                 // foot lift (px)
    kickL: 0, kickR: 0, legReach: 1,  // leg swing (deg, + = forward) and stretch
    armL: 40, armR: 14,               // arm raise (deg, + = fist up)
    reachL: 1, reachR: 1,             // arm stretch along its length
    headRot: 0, headX: 0, headY: 0,   // head bob around the neck
    turn: 0,                          // 0 = face the opponent, 1 = face the camera
    blink: 0,                         // 0 open → 1 shut
    lookX: 0.6, lookY: 0.1,           // pupils, -1…1 (+x = toward the opponent)
    browL: 0, browR: 0,               // brow drop (px, negative = raised)
    browTiltL: 0, browTiltR: 0,       // extra brow rotation (deg)
    mouth: 0.55,                      // 0 shut → 1 wide open
    rage: 0.12, throb: 0,             // face flush + vein size, vein pulse
    hatY: 0, hatRot: 0, flop: 0,      // hat (and hair) pop; hair / pom-pom / brim flop (-1…1)
    steam: 0,                         // ear-steam puff progress 0…1
    spit: 0,                          // spit-spray progress 0…1
  });

  /* Named poses (partial states merged over BASE). Shown in design-system.html
     and used as keyframes by the idle loop and the brawl. */
  const POSES = {
    idle: {},
    yell: { mouth: 1, lean: 9, headRot: 5, headY: -4, armL: 62, armR: 40, browL: 3, browR: 4, spit: 0.45, rage: 0.3, flop: 0.6 },
    grit: { mouth: 0.22, lean: 6, headRot: -2, armL: -30, armR: -28, browL: 5, browR: 6, browTiltL: 5, browTiltR: -5 },
    flail: { mouth: 0.8, lean: 3, headRot: -5, armL: 72, armR: 60, sy: 1.03, lookY: -0.3, flop: -0.6 },
    windup: { armR: -58, armL: 30, lean: -7, x: -8, sy: 0.97, headRot: -7, mouth: 0.25, browR: 5, lookX: 1 },
    punch: { armR: 2, reachR: 1.55, lean: 14, x: 16, headRot: 6, mouth: 0.95, browL: 4, browR: 5, armL: 44, flop: 1 },
    flinch: { lean: -8, x: -12, headRot: -12, blink: 0.85, mouth: 0.14, armL: 50, armR: 58, browL: 6, browR: 6, flop: -1 },
    blink: { blink: 1, mouth: 0.25 },
    rage: { rage: 1, throb: 1, mouth: 0.9, browL: 6, browR: 7, lean: 8 },
    steam: { rage: 0.55, steam: 0.55, mouth: 0.75, headY: -6, hatY: -24, hatRot: -7, flop: 1, browL: -6, browR: -4 },
    camera: { turn: 1, mouth: 0.08, lookX: 0, lookY: 0, browL: -8, browR: -6, browTiltL: -10, browTiltR: 10, lean: 1, armL: -36, armR: -36, rage: 0 },
    ko: { rot: -9, lean: -12, headRot: -16, x: -10, mouth: 0.55, blink: 0.9, armL: 64, armR: 70, browL: -6, browR: -6, flop: -1 },
    lookUp: { lookX: 0.1, lookY: -1, headRot: -7, mouth: 0.45 },
    lookDown: { lookX: 0.6, lookY: 1, headRot: 5, mouth: 0.35 },
    kick: { kickR: 92, legReach: 2, lean: -13, x: 12, y: -4, armL: 56, armR: 34, mouth: 0.95, headRot: -6, flop: 0.8 },
    uppercut: { armR: 46, reachR: 1.45, sy: 1.07, y: -6, lean: -3, headRot: -8, mouth: 1, flop: 1 },
    guard: { armL: 22, armR: 10, reachL: 0.85, reachR: 0.85, lean: -5, x: -6, headRot: -6, blink: 0.35, mouth: 0.2, browL: 5, browR: 5 },
    victory: { armL: 62, armR: 58, mouth: 1, lean: 2, headRot: -4, flop: 1, rage: 0.2 },
    filibuster: { mouth: 1, lean: 14, headRot: 8, headY: -4, spit: 0.6, armL: 70, armR: 40, browL: 6, browR: 7, rage: 0.8, flop: 1 },
  };

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const r2 = (v) => Math.round(v * 100) / 100;
  const easeOut = (t) => 1 - (1 - t) * (1 - t);

  const GROUND = [204, 447];       // feet anchor for whole-body scale/rotate
  const MOUTH_DEPTH = 70;          // full-open cavity depth below the top lip
  const FACE_TURN = 22;            // how far features slide to face the camera
  const EARS = { l: [48, 190], r: [352, 186] };
  const SPIT_FROM = [290, 240];

  let cssInjected = false;
  let uid = 0;

  function injectCSS() {
    if (cssInjected || document.getElementById('rig-css')) return;
    const style = document.createElement('style');
    style.id = 'rig-css';
    style.textContent = RIG_CSS;
    document.head.appendChild(style);
    cssInjected = true;
  }

  function pivotOf(el) {
    const p = (el && el.getAttribute('data-pivot')) || '0 0';
    return p.split(/[\s,]+/).map(Number);
  }

  /* Rotate about (cx, cy), then scale about the same point. */
  function around(cx, cy, deg, sx, sy) {
    let t = `translate(${cx} ${cy})`;
    if (deg) t += ` rotate(${r2(deg)})`;
    if (sx !== 1 || sy !== 1) t += ` scale(${r2(sx)} ${r2(sy)})`;
    return `${t} translate(${-cx} ${-cy})`;
  }

  /**
   * Build one character.
   * @param {'left'|'right'} teamId
   * @param {{state?: object, pose?: string, variant?: 'guy'|'gal', hat?: 'beanie'|'cap'|null, static?: boolean}} [opts]
   */
  function create(teamId, opts = {}) {
    const team = TEAMS[teamId];
    if (!team) throw new Error(`Unknown team "${teamId}"`);
    injectCSS();

    const tpl = document.createElement('template');
    tpl.innerHTML = RIG_MARKUP.trim();
    const svg = tpl.content.firstElementChild;
    svg.setAttribute('data-team', team.id);
    svg.setAttribute('data-variant', opts.variant || team.variant);
    const hat = opts.hat !== undefined ? opts.hat : team.hat;
    if (hat) svg.setAttribute('data-hat', hat);

    // ids → data-part, plus unique prefixed ids so two rigs can share a page
    const prefix = `${team.id}${++uid}-`;
    svg.querySelectorAll('[id]').forEach((el) => {
      el.setAttribute('data-part', el.id);
      el.id = prefix + el.id;
    });
    svg.querySelectorAll('[clip-path],[href]').forEach((el) => {
      ['clip-path', 'href'].forEach((attr) => {
        const v = el.getAttribute(attr);
        if (v) el.setAttribute(attr, v.replace(/#(char-[\w-]+)/g, `#${prefix}$1`));
      });
    });

    const q = (name) => svg.querySelector(`[data-part="${name}"]`);
    const P = {
      root: q('char-root'), legL: q('char-leg-l'), legR: q('char-leg-r'), upper: q('char-upper'),
      armL: q('char-arm-l'), armR: q('char-arm-r'), body: q('char-body'), head: q('char-head'),
      face: q('char-face'), eyes: q('char-eyes'), pupils: q('char-pupils'),
      browL: q('char-brow-l'), browR: q('char-brow-r'), mouth: q('char-mouth'),
      cavity: q('char-mouth-cavity'), mouthLine: q('char-mouth-line'), jaw: q('char-jaw'),
      flush: q('char-flush'), hat: q('char-hat'),
    };
    const flushes = [P.flush, ...q('char-ears').querySelectorAll('.flush')];
    const veins = [...svg.querySelectorAll('.vein')].map((el) => ({ el, p: pivotOf(el) }));
    const flops = [...svg.querySelectorAll('.flop')].map((el) => ({ el, p: pivotOf(el), kind: el.getAttribute('data-flop') }));
    const hairTops = [...svg.querySelectorAll('.hair-top')].map((el) => ({ el, p: pivotOf(el) }));
    const steamL = [...svg.querySelectorAll('.steam-l')];
    const steamR = [...svg.querySelectorAll('.steam-r')];
    const spits = [...svg.querySelectorAll('.spit')];

    const piv = {
      upper: pivotOf(P.upper), armL: pivotOf(P.armL), armR: pivotOf(P.armR), head: pivotOf(P.head),
      eyes: pivotOf(P.eyes), browL: pivotOf(P.browL), browR: pivotOf(P.browR), mouth: pivotOf(P.mouth),
      hat: pivotOf(P.hat), legL: pivotOf(P.legL), legR: pivotOf(P.legR),
    };

    const state = Object.assign({}, BASE, opts.pose ? POSES[opts.pose] : null, opts.state);
    const last = new WeakMap();
    const setT = (el, v) => { if (el && last.get(el) !== v) { last.set(el, v); el.setAttribute('transform', v); } };
    const setO = (el, v) => {
      v = String(r2(clamp(v, 0, 1)));
      if (el && last.get(el) !== 'o' + v) { last.set(el, 'o' + v); el.setAttribute('opacity', v); }
    };

    function apply() {
      const s = state;
      const mirror = team.facing < 0 ? 'translate(400 0) scale(-1 1) ' : '';
      setT(P.root, `${mirror}translate(${r2(s.x)} ${r2(s.y)}) ${around(GROUND[0], GROUND[1], s.rot, s.sx, s.sy)}`);
      // legs lift for stamps and swing forward (and stretch) for kicks
      setT(P.legL, `translate(0 ${r2(-s.legL)}) ${around(piv.legL[0], piv.legL[1], -s.kickL, 1, s.kickL ? s.legReach : 1)}`);
      setT(P.legR, `translate(0 ${r2(-s.legR)}) ${around(piv.legR[0], piv.legR[1], -s.kickR, 1, s.kickR ? s.legReach : 1)}`);
      setT(P.upper, around(piv.upper[0], piv.upper[1], s.lean, 1, s.bodySY));
      setT(P.armL, around(piv.armL[0], piv.armL[1], s.armL, s.reachL, 1));
      setT(P.armR, around(piv.armR[0], piv.armR[1], -s.armR, s.reachR, 1));
      setT(P.head, `translate(${r2(s.headX)} ${r2(s.headY)}) ${around(piv.head[0], piv.head[1], s.headRot, 1, 1)}`);
      setT(P.face, `translate(${r2(-FACE_TURN * s.turn)} ${r2(2 * s.turn)})`);

      // blink squashes whites, lashes and pupils together toward the eye line
      setT(P.eyes, around(piv.eyes[0], piv.eyes[1], 0, 1, 1 - 0.92 * clamp(s.blink, 0, 1)));
      setT(P.pupils, `translate(${r2(clamp(s.lookX, -1, 1) * 8)} ${r2(clamp(s.lookY, -1, 1) * 9)})`);
      setT(P.browL, `translate(0 ${r2(s.browL)}) ${around(piv.browL[0], piv.browL[1], s.browTiltL, 1, 1)}`);
      setT(P.browR, `translate(0 ${r2(s.browR)}) ${around(piv.browR[0], piv.browR[1], s.browTiltR, 1, 1)}`);

      // mouth: the cavity scales from its top lip, the jaw rides its bottom edge
      const m = clamp(s.mouth, 0, 1);
      const sy = lerp(0.1, 1, m);
      setT(P.mouth, around(piv.mouth[0], piv.mouth[1], 0, lerp(0.92, 1.05, m), 1));
      const cav = around(0, piv.mouth[1], 0, 1, sy);
      setT(P.cavity, cav);
      setT(P.mouthLine, cav);
      setT(P.jaw, `translate(0 ${r2(-(1 - sy) * MOUTH_DEPTH)})`);

      // rage: flush the face, grow the veins
      const rage = clamp(s.rage, 0, 1);
      flushes.forEach((el) => setO(el, rage * 0.85));
      const vk = lerp(0.5, 1.35, rage) * (1 + 0.12 * s.throb);
      veins.forEach(({ el, p }) => setT(el, around(p[0], p[1], 0, vk, vk)));

      setT(P.hat, `translate(0 ${r2(s.hatY)}) ${around(piv.hat[0], piv.hat[1], s.hatRot, 1, 1)}`);
      flops.forEach(({ el, p, kind }) => {
        const k = clamp(s.flop, -1.5, 1.5);
        if (kind === 'lock') setT(el, around(p[0], p[1], 3 * k, 1, 1));
        else if (kind === 'tuft') setT(el, around(p[0], p[1], -12 * k, 1, 1));
        else if (kind === 'pom') setT(el, `translate(0 ${r2(-5 * k)}) ${around(p[0], p[1], 10 * k, 1, 1)}`);
        else if (kind === 'brim') setT(el, around(p[0], p[1], -5 * k, 1, 1));
      });
      // no hat to pop? the hair jumps a little instead
      hairTops.forEach(({ el, p }) => setT(el, `translate(0 ${r2(s.hatY * 0.2)}) ${around(p[0], p[1], s.hatRot * 0.3, 1, 1 - s.hatY * 0.003)}`));

      // ear steam: three puffs per ear, staggered
      const st = clamp(s.steam, 0, 1);
      [[steamL, EARS.l, -1], [steamR, EARS.r, 1]].forEach(([puffs, ear, dir]) => {
        puffs.forEach((el, i) => {
          const t = clamp((st - i * 0.12) / 0.64, 0, 1);
          const k = lerp(0.4, 1.55, easeOut(t));
          setT(el, `translate(${r2(ear[0] + dir * (30 + 20 * i) * t)} ${r2(ear[1] - (26 + 28 * i) * t)}) scale(${r2(k)})`);
          setO(el, t <= 0 ? 0 : t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3);
        });
      });

      // spit spray from the front corner of the mouth
      const sp = clamp(s.spit, 0, 1);
      spits.forEach((el, i) => {
        const t = clamp((sp - i * 0.08) / 0.76, 0, 1);
        setT(el, `translate(${r2(SPIT_FROM[0] + (26 + 16 * i) * t)} ${r2(SPIT_FROM[1] + (-18 + 12 * i) * t + 20 * t * t)})`);
        setO(el, t <= 0 || t >= 1 ? 0 : 1 - t * t);
      });
    }

    // Outline width tracks the rendered size (3.6 viewBox px), clamped for tiny renders.
    let ro = null;
    if (!opts.static && 'ResizeObserver' in root) {
      ro = new ResizeObserver((entries) => {
        const w = entries[0].contentRect.width;
        if (w > 0) svg.style.setProperty('--ow', `${r2(clamp((3.6 * w) / 400, 1.4, 5))}px`);
      });
      ro.observe(svg);
    }

    const char = {
      team,
      el: svg,
      state,
      parts: P,
      apply,
      /** Replace the state with BASE + a named pose (+ overrides). */
      pose(name, extra) {
        Object.assign(state, BASE, POSES[name] || {}, extra);
        apply();
        return char;
      },
      /** Merge values into the current state. */
      set(values) {
        Object.assign(state, values);
        apply();
        return char;
      },
      /** Screen position of the midpoint between the eyes (for cursor tracking). */
      eyeCentre() {
        const m = P.eyes.getScreenCTM();
        if (!m) return null;
        const p = new DOMPoint(piv.eyes[0], piv.eyes[1]).matrixTransform(m);
        return { x: p.x, y: p.y };
      },
      /** Standalone SVG string of the current pose (for downloads / PFP canvas). */
      toSVG({ width = 400, height = 460, outline = 3.6 * (width / 400), viewBox } = {}) {
        apply();
        const cs = getComputedStyle(document.documentElement);
        const vars = TOKENS.map((t) => `--${t}:${cs.getPropertyValue('--' + t).trim()}`).join(';');
        const clone = svg.cloneNode(true);
        clone.removeAttribute('style');
        clone.setAttribute('width', width);
        clone.setAttribute('height', height);
        if (viewBox) clone.setAttribute('viewBox', viewBox);
        clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        style.textContent = `svg{${vars};--ow:${r2(outline)}px}${RIG_CSS}`;
        clone.insertBefore(style, clone.firstChild);
        return new XMLSerializer().serializeToString(clone);
      },
      destroy() {
        if (ro) ro.disconnect();
        svg.remove();
      },
    };
    apply();
    return char;
  }

  LR.rig = { TEAMS, BASE, POSES, TOKENS, create, css: RIG_CSS };
})(window);
