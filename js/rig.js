/* ==========================================================================
   LEFT RIGHT — character rig
   --------------------------------------------------------------------------
   ONE SVG rig in a flat cutout-cartoon style, drawn facing right. LEFTY
   (red, left) uses it as drawn; RIGHTY (blue, right) is the same rig
   mirrored and recoloured. Same body, face and size for both fighters.
   Accessories differ: hat (beanie + pom-pom / cap + brim) and hair
   (guy: side tufts / gal: bangs, side locks, lashes, ponytail).

   Parts (ids in RIG_MARKUP):
     #char-body  #char-head  #char-hat  #char-eyes  #char-pupils  #char-brows
     #char-mouth #char-arm-l #char-arm-r #char-legs
   Helpers:
     #char-root #char-upper (lean) #char-face #char-brow-l/-r #char-leg-l/-r
     #char-jaw #char-flush #char-veins #char-ears #char-steam #char-spit
     #char-pom #char-brim #char-ponytail (secondary "flop" motion)
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
<g id="char-ponytail" class="gal-only flop" data-pivot="84 110" data-flop="tail">
<path class="f-hair line" d="M91.6 100.1C90.8 93.3 70.3 85.7 59.3 84.1C48.4 82.4 35 84.4 25.9 90.2C16.7 96 9.6 106.8 4.3 118.8C-1 130.8 -5.6 147.2 -6 162.2C-6.3 177.1 -2.4 195.8 2.3 208.6C7.1 221.5 18.7 237.2 22.6 239.3C26.4 241.3 33.4 234.6 35.5 226.2C37.5 217.9 34 201.9 34.8 189.2C35.5 176.6 35.1 161 40 150.2C44.9 139.4 55.7 132.9 64.3 124.5C72.9 116.2 92.4 106.8 91.6 100.1Z"/>
<path class="line-thin" d="M40 104C36.7 109.3 24 123.3 20 136C16 148.7 16.7 172.7 16 180"/>
<path class="line-thin" d="M60 110C57.3 115 47.3 129.7 44 140C40.7 150.3 40.7 166.7 40 172"/>
<path class="f-team-dark line-soft" d="M95.7 107.8C95.7 111.3 94.5 116 92.5 118.6C90.5 121.1 86.6 123.2 83.8 123.2C81 123.3 77.7 121.3 75.7 118.7C73.8 116.2 72 111.5 72 108C72 104.5 73.5 100.1 75.5 97.7C77.4 95.2 81 93.2 83.8 93.1C86.7 93 90.6 94.7 92.6 97.2C94.6 99.6 95.8 104.2 95.7 107.8Z"/>
</g>
<g id="char-ears">
<path class="f-skin line" d="M70.6 191.2C69.7 194.7 67.7 198.6 65.6 200.7C63.5 202.8 60.4 203.8 58 203.8C55.5 203.7 52.9 202.6 50.9 200.6C48.8 198.6 46.6 195 45.7 191.7C44.8 188.3 44.5 183.8 45.2 180.5C46 177.1 48.2 173.7 50.2 171.6C52.3 169.5 55.1 167.9 57.6 167.8C60.1 167.7 63.1 169 65.3 171C67.4 173 69.7 176.5 70.6 179.8C71.5 183.2 71.4 187.8 70.6 191.2Z"/>
<path class="f-skin line" d="M352.5 186.5C351.9 189.4 350.5 192.6 348.7 194.5C346.9 196.4 343.9 197.9 341.8 197.9C339.7 198 337.6 196.7 335.9 194.9C334.2 193.1 332.5 190.1 331.8 187.1C331 184.1 330.8 179.9 331.5 176.9C332.1 173.9 333.8 171.1 335.6 169.3C337.3 167.5 340 166.2 342.1 166.1C344.2 166 346.6 166.9 348.2 168.7C349.9 170.5 351.3 173.8 352.1 176.7C352.8 179.7 353 183.5 352.5 186.5Z"/>
<g class="flush" opacity="0"><path class="f-flush line" d="M70.6 191.2C69.7 194.7 67.7 198.6 65.6 200.7C63.5 202.8 60.4 203.8 58 203.8C55.5 203.7 52.9 202.6 50.9 200.6C48.8 198.6 46.6 195 45.7 191.7C44.8 188.3 44.5 183.8 45.2 180.5C46 177.1 48.2 173.7 50.2 171.6C52.3 169.5 55.1 167.9 57.6 167.8C60.1 167.7 63.1 169 65.3 171C67.4 173 69.7 176.5 70.6 179.8C71.5 183.2 71.4 187.8 70.6 191.2Z"/><path class="f-flush line" d="M352.5 186.5C351.9 189.4 350.5 192.6 348.7 194.5C346.9 196.4 343.9 197.9 341.8 197.9C339.7 198 337.6 196.7 335.9 194.9C334.2 193.1 332.5 190.1 331.8 187.1C331 184.1 330.8 179.9 331.5 176.9C332.1 173.9 333.8 171.1 335.6 169.3C337.3 167.5 340 166.2 342.1 166.1C344.2 166 346.6 166.9 348.2 168.7C349.9 170.5 351.3 173.8 352.1 176.7C352.8 179.7 353 183.5 352.5 186.5Z"/></g>
</g>
<path class="f-skin line" d="M340.6 197.1C338.2 210.7 331.6 224.6 323.9 236.8C316.2 249 306.1 261.1 294.2 270.1C282.4 279 268.1 285.9 252.9 290.7C237.7 295.4 219.2 298.3 202.9 298.7C186.7 299.1 170.3 297 155.1 292.9C139.9 288.8 124.2 282.6 111.7 274C99.2 265.3 88.5 253 80.1 241C71.6 229 64.5 215.4 61.1 202C57.7 188.6 57.3 174.3 59.5 160.6C61.8 147 67.1 132.5 74.7 120C82.3 107.6 93.3 95.2 105.3 85.7C117.3 76.3 131.6 67.9 146.9 63.1C162.1 58.3 180.4 57.2 196.8 57C213.2 56.8 229.9 57.5 245.2 61.8C260.5 66.2 276.1 74.4 288.6 83.1C301.1 91.8 311.7 102.1 320.1 114C328.4 126 335 141.1 338.5 154.9C341.9 168.8 343 183.4 340.6 197.1Z"/>
<g id="char-flush" opacity="0"><path class="f-flush line" d="M340.6 197.1C338.2 210.7 331.6 224.6 323.9 236.8C316.2 249 306.1 261.1 294.2 270.1C282.4 279 268.1 285.9 252.9 290.7C237.7 295.4 219.2 298.3 202.9 298.7C186.7 299.1 170.3 297 155.1 292.9C139.9 288.8 124.2 282.6 111.7 274C99.2 265.3 88.5 253 80.1 241C71.6 229 64.5 215.4 61.1 202C57.7 188.6 57.3 174.3 59.5 160.6C61.8 147 67.1 132.5 74.7 120C82.3 107.6 93.3 95.2 105.3 85.7C117.3 76.3 131.6 67.9 146.9 63.1C162.1 58.3 180.4 57.2 196.8 57C213.2 56.8 229.9 57.5 245.2 61.8C260.5 66.2 276.1 74.4 288.6 83.1C301.1 91.8 311.7 102.1 320.1 114C328.4 126 335 141.1 338.5 154.9C341.9 168.8 343 183.4 340.6 197.1Z"/></g>
<g class="guy-only">
<path class="f-hair line-soft" d="M63.9 123.8C67.8 121.1 79 125 84.3 126.2C89.7 127.3 94.9 128.5 95.8 130.6C96.8 132.7 92.6 138 90.2 138.8C87.9 139.7 84.2 134.4 81.7 135.7C79.3 137 77.7 146.3 75.6 146.7C73.5 147.1 71.5 139 69.1 138.2C66.7 137.4 62 144.3 61.1 141.9C60.3 139.5 60 126.4 63.9 123.8Z"/>
<path class="f-hair line-soft" d="M306 126.2C307.9 123.3 316.9 122 322.3 120.7C327.6 119.3 335.3 115.9 338.1 118C340.9 120.1 340.4 131 339.1 133C337.9 135.1 332.7 128.9 330.7 130.2C328.8 131.4 329.2 140.2 327.2 140.7C325.2 141.3 321.5 133.8 318.8 133.3C316.1 132.9 313.2 139.3 311.1 138.1C309 136.9 304.2 129.1 306 126.2Z"/>
</g>
<g class="gal-only">
<path class="f-hair line" d="M56.4 118.1C61.8 111 83.1 117.3 90.4 123.6C97.7 129.9 99.5 144 100.1 156C100.6 168 97 183.8 93.7 195.8C90.3 207.8 82.9 227.3 80.2 228.2C77.4 229.2 70 216.1 66.2 205.7C62.5 195.4 59.4 180.6 57.8 166C56.1 151.4 51 125.1 56.4 118.1Z"/>
<path class="f-hair line" d="M313.8 118.3C318.2 112 338.1 105.9 344.1 112.2C350 118.6 350 141.8 349.7 156.4C349.3 170.9 344.4 197 342.2 199.7C340 202.5 332 192.1 328 183.8C324 175.6 320.6 161 318.3 150.1C315.9 139.2 309.5 124.6 313.8 118.3Z"/>
<path class="f-hair line" d="M88.1 120.2C90.7 119.3 133.6 125.5 140.1 126.2C146.6 126.8 193.1 130.8 200.2 130.9C207.3 131.1 254.9 129.7 261.8 129.1C268.6 128.4 315.2 119.5 318.2 120.2C321.1 121 313.1 141.1 311.8 141.9C310.5 142.7 297.2 133.7 295.7 134.3C294.2 134.9 287.8 151.8 286.2 152C284.6 152.2 270.2 138 268.2 138.1C266.2 138.2 254 154 252.1 154.1C250.2 154.3 237.8 140.1 235.9 140.1C234 140 221.7 154 219.8 154C218 154 205.8 140.2 203.9 140C202.1 139.9 189.6 152.1 187.8 152C185.9 151.9 173.9 138.4 172.1 138.2C170.2 138.1 157.6 150.2 155.9 150.1C154.1 150 143.8 136.5 141.9 136.3C140.1 136 125.6 146.4 123.7 146.2C121.9 145.9 111.6 132 110 131.7C108.3 131.5 97.2 142.6 95.9 142C94.6 141.3 85.5 121.1 88.1 120.2Z"/>
</g>
<g id="char-veins">
<g class="vein" data-pivot="108 140"><path class="f-vein line-soft" d="M102.3 142.6C101.3 143.7 103.2 143.7 103.8 144.5C104.4 145.2 105.2 146.2 105.8 147.1C106.4 147.9 107.1 148.9 107.5 149.6C107.8 150.2 108 150.5 108.1 150.9C108.1 151.3 108.1 151.3 107.8 151.9C107.4 152.4 106.7 153.3 106.1 154.2C105.4 155.2 104.4 156.2 103.8 157.6C103.2 158.9 102.6 160.6 102.7 162.1C102.7 163.6 103.5 165.2 104.1 166.6C104.8 167.9 105.8 169.2 106.6 170.4C107.4 171.5 108.4 172.7 109.1 173.5C109.8 174.4 109.7 175.8 110.8 175.6C111.8 175.4 114.7 173.3 115.2 172.4C115.7 171.5 114.4 171 113.8 170.1C113.2 169.2 112.3 168 111.7 167C111 165.9 110.3 164.7 109.9 163.9C109.5 163 109.3 162.4 109.3 161.9C109.3 161.4 109.5 161.4 109.9 160.8C110.4 160.3 111.1 159.5 111.8 158.6C112.5 157.8 113.6 156.8 114.3 155.6C115 154.3 115.8 152.6 115.9 151.1C116 149.6 115.4 147.8 114.9 146.4C114.4 145 113.6 143.7 112.9 142.5C112.3 141.4 111.5 140.3 110.9 139.5C110.4 138.6 111.1 136.9 109.7 137.4C108.3 138 103.3 141.4 102.3 142.6Z"/></g>
<g class="vein" data-pivot="305 136"><path class="f-vein line-soft" d="M302.6 133.8C301.3 133.5 302 135.1 301.4 136.1C300.9 137 300.1 138.2 299.4 139.4C298.8 140.6 298 142 297.5 143.5C297.1 145 296.6 146.6 296.8 148.1C296.9 149.6 297.6 151.2 298.2 152.6C298.9 153.9 299.9 155.2 300.7 156.4C301.6 157.5 302.6 158.6 303.3 159.4C304 160.3 304 161.6 305 161.5C305.9 161.3 308.6 159.4 309 158.5C309.5 157.7 308.2 157.1 307.6 156.2C307 155.3 306.1 154.2 305.5 153.1C304.9 152.1 304.2 150.9 303.8 150C303.4 149.1 303.2 148.5 303.2 147.9C303.3 147.2 303.5 146.7 303.9 145.9C304.3 145.1 305 144 305.7 143.1C306.3 142.1 307.2 141.1 307.8 140.2C308.4 139.4 310.2 139.2 309.4 138.2C308.5 137.1 304 134.2 302.6 133.8Z"/></g>
</g>
<g id="char-face">
<g id="char-eyes" data-pivot="222 174">
<path class="f-paper line" d="M220.3 184.7C218.6 189.9 215.3 195 211.8 198.6C208.3 202.3 203.7 205.3 199.3 206.4C194.8 207.5 189.1 207 184.9 205.3C180.6 203.6 176.7 200.3 173.8 196.3C171 192.2 168.5 186.7 167.9 181.2C167.3 175.7 168.5 168.7 170.2 163.4C171.9 158.2 174.6 153.3 178.1 149.6C181.7 146 186.9 142.6 191.3 141.5C195.7 140.3 200.5 141 204.6 142.8C208.8 144.6 213.2 148.2 216.1 152.2C219.1 156.3 221.5 161.8 222.2 167.2C222.9 172.6 222 179.4 220.3 184.7Z"/>
<path class="f-paper line" d="M275.6 177.1C275.5 182.6 274.5 188.8 272.2 193.2C270 197.6 266.1 201.2 262.1 203.4C258.2 205.7 253.2 207 248.7 206.6C244.2 206.1 239 203.9 235.1 200.7C231.1 197.5 227.4 192.4 225.3 187.5C223.1 182.5 222.1 176.3 222.2 171C222.3 165.7 223.6 160 226 155.5C228.3 151 232.4 146.5 236.3 144.2C240.3 141.9 245.2 141 249.8 141.5C254.3 142 259.9 144.2 263.7 147.2C267.5 150.3 270.8 154.8 272.8 159.7C274.8 164.7 275.7 171.5 275.6 177.1Z"/>
<g class="gal-only"><path class="line-lash" d="M172.8 159.9C170.6 158.9 161.8 154.9 159.6 153.9"/><path class="line-lash" d="M179.3 150.4C177.5 148.7 170.6 141.9 168.9 140.2"/><path class="line-lash" d="M188 144.4C187.1 142.1 183.3 133.2 182.4 131"/><path class="line-lash" d="M256 144.4C256.9 142.1 260.7 133.2 261.6 131"/><path class="line-lash" d="M264.7 150.4C266.5 148.7 273.4 141.9 275.1 140.2"/><path class="line-lash" d="M271.2 159.9C273.4 158.9 282.2 154.9 284.4 153.9"/></g>
<g id="char-pupils"><circle class="f-ink" cx="204" cy="180" r="5.8"/><circle class="f-ink" cx="258" cy="180" r="5.8"/></g>
</g>
<g id="char-brows">
<g id="char-brow-l" data-pivot="192 146"><path class="f-ink" d="M164.6 131.2C167.1 130.5 183.3 133.9 192.4 136.2C201.5 138.6 216.6 143.2 219.1 145.3C221.6 147.3 220.1 156.4 217.3 156.7C214.5 157 199.5 150.4 191.1 148.1C182.8 145.8 170 144.8 167.4 143.1C164.7 141.4 162.1 131.9 164.6 131.2Z"/></g>
<g id="char-brow-r" data-pivot="256 149"><path class="f-ink" d="M227.4 151.6C230.1 149.3 246.8 145.6 256.1 142.3C265.3 138.9 279.8 131.5 282.6 131.7C285.5 132 287.4 142.6 284.8 144.8C282.2 147 266 150.5 256.7 153.9C247.4 157.2 231.8 165.2 228.8 165C225.9 164.8 224.6 153.9 227.4 151.6Z"/></g>
</g>
<g id="char-mouth" data-pivot="224 224">
<clipPath id="char-mouth-clip"><use href="#char-mouth-cavity"/></clipPath>
<path id="char-mouth-cavity" class="f-mouth" d="M162 234C163.5 231.8 175.7 228 186 226C196.3 224 211.3 222.2 224 222C236.7 221.8 251.7 223.3 262 225C272.3 226.7 284.5 229.8 286 232C287.5 234.2 284.8 246.5 282 254C279.2 261.5 274.7 270.7 269 277C263.3 283.3 255.5 288.8 248 292C240.5 295.2 232 296 224 296C216 296 207.5 295.2 200 292C192.5 288.8 184.7 283.2 179 277C173.3 270.8 168.8 262.2 166 255C163.2 247.8 160.5 236.2 162 234Z"/>
<g clip-path="url(#char-mouth-clip)">
<g id="char-jaw">
<path class="f-tongue line" d="M257.4 288.3C257.3 290.8 254.9 293.8 251.2 295.9C247.5 297.9 241.1 299.8 235.3 300.5C229.5 301.3 222.3 301.3 216.6 300.4C211 299.5 204.8 297.4 201.3 295.3C197.7 293.3 195.5 290.7 195.4 288.2C195.3 285.7 197.2 282.3 200.7 280.2C204.2 278.2 210.4 276.7 216.2 275.9C222 275.2 229.5 274.9 235.4 275.7C241.3 276.5 247.7 278.6 251.4 280.7C255.1 282.8 257.4 285.7 257.4 288.3Z"/>
<path class="line-thin" d="M226 279C226.2 281.7 226.8 292.3 227 295"/>
</g>
<path class="f-paper line" d="M156.2 222.2C161.9 217.7 180.4 216.6 191.8 215C203.1 213.3 213.1 212.3 224.2 212.1C235.3 212 246.9 212.7 258.3 214.2C269.6 215.6 287 216.6 292.2 220.7C297.5 224.9 295.5 237 289.8 239.2C284.2 241.4 269.2 234.8 258.3 233.8C247.3 232.8 235 233 224 233.2C213 233.4 203.2 233.6 192.1 235C181.1 236.4 163.9 244 157.9 241.9C151.9 239.7 150.6 226.7 156.2 222.2Z"/>
<path class="line-thin" d="M190 217C190 220.1 190 232.3 190 235.4"/>
<path class="line-thin" d="M212 217C212 219.8 212 231 212 233.8"/>
<path class="line-thin" d="M236 217C236 219.7 236 230.6 236 233.4"/>
<path class="line-thin" d="M258 217C258 219.8 258 231.2 258 234"/>
</g>
<path id="char-mouth-line" class="line f-none" d="M162 234C163.5 231.8 175.7 228 186 226C196.3 224 211.3 222.2 224 222C236.7 221.8 251.7 223.3 262 225C272.3 226.7 284.5 229.8 286 232C287.5 234.2 284.8 246.5 282 254C279.2 261.5 274.7 270.7 269 277C263.3 283.3 255.5 288.8 248 292C240.5 295.2 232 296 224 296C216 296 207.5 295.2 200 292C192.5 288.8 184.7 283.2 179 277C173.3 270.8 168.8 262.2 166 255C163.2 247.8 160.5 236.2 162 234Z"/>
</g>
<g id="char-spit"><g class="spit"><path class="f-paper line-soft" d="M5 0C5 1.2 3.6 3.2 2.3 3.7C1 4.3 -1.5 4 -2.7 3.4C-3.9 2.9 -5 1.5 -4.9 0.3C-4.9 -0.9 -3.5 -2.9 -2.2 -3.6C-1 -4.2 1.4 -4 2.6 -3.4C3.8 -2.8 5.1 -1.2 5 0Z"/></g><g class="spit"><path class="f-paper line-soft" d="M4.2 0C4.2 0.9 3 2.6 1.9 3.1C0.9 3.5 -1.1 3.1 -2.1 2.6C-3.1 2.2 -3.9 1.1 -3.9 0.2C-3.9 -0.6 -3 -2 -2 -2.5C-1 -3 1.1 -3.2 2.1 -2.8C3.1 -2.4 4.2 -1 4.2 0Z"/></g><g class="spit"><path class="f-paper line-soft" d="M5.8 -0.2C5.8 1.2 4.3 3.6 2.9 4.4C1.4 5.1 -1.5 4.9 -3 4.2C-4.5 3.5 -6 1.6 -6 0.2C-6.1 -1.1 -4.7 -3.3 -3.2 -4.1C-1.7 -4.9 1.3 -4.9 2.8 -4.3C4.3 -3.6 5.8 -1.7 5.8 -0.2Z"/></g><g class="spit"><path class="f-paper line-soft" d="M3.4 -0.1C3.4 0.7 2.6 2 1.7 2.4C0.8 2.8 -1 2.6 -1.9 2.2C-2.7 1.8 -3.5 0.7 -3.4 0C-3.4 -0.8 -2.4 -2 -1.5 -2.5C-0.6 -2.9 1 -2.9 1.8 -2.5C2.6 -2.2 3.4 -0.9 3.4 -0.1Z"/></g></g>
</g>
<g id="char-hat" data-pivot="200 120">
<g class="hat hat-beanie">
<path class="f-team line" d="M56.6 104.1C51.5 101.2 54.6 86 59.3 76.6C64 67.1 72.7 55.2 84.6 47.3C96.6 39.5 111.6 33.4 130.7 29.6C149.8 25.7 176.1 24 199.3 24.1C222.6 24.2 251.1 26.2 270.4 30.1C289.6 34 303.4 40.3 315.1 47.7C326.7 55.2 335.1 66.1 340 75.1C344.9 84.1 349.3 98.5 344.3 101.7C339.3 105 313.8 105.7 289.8 107.4C265.8 109.1 230.1 112.3 200.2 111.9C170.4 111.5 134.6 106.4 110.6 105.1C86.7 103.8 61.7 106.9 56.6 104.1Z"/>
<path class="line-thin" d="M150 38C151.7 43.3 159 60 160 70C161 80 156.7 93.3 156 98"/>
<path class="line-thin" d="M254 38C253.3 43.3 250 60 250 70C250 80 253.3 93.3 254 98"/>
<path class="f-team-dark line" d="M57.6 93.6C62.1 92.2 85.8 99.8 109.5 102.1C133.1 104.5 169.7 107.2 199.7 107.5C229.8 107.8 266.1 106.4 289.7 103.9C313.4 101.3 337 91.1 341.5 92.2C346 93.2 348 112.9 343.7 115.9C339.5 118.9 314.1 125.8 290.2 128.4C266.2 131.1 230.2 132.3 200.2 131.9C170.3 131.4 134.5 127.8 110.4 125.6C86.4 123.3 60.4 121.2 56 118.5C51.6 115.9 53.2 95 57.6 93.6Z"/>
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
<path class="f-paper line" d="M231.9 28.8C230.5 31.9 233.2 37.6 231.2 39.6C229.3 41.6 223.2 39.7 220 41C216.9 42.2 215.3 46.2 212.3 46.9C209.3 47.6 205.2 46.2 201.9 45.3C198.6 44.5 195.3 43.5 192.3 42C189.3 40.5 185.6 39 184 36.4C182.3 33.8 183.5 29.6 182.2 26.5C181 23.5 176.3 20.6 176.6 18C177 15.4 183 13.7 184.4 10.8C185.8 7.9 183 2.3 184.9 0.4C186.8 -1.5 192.5 0.5 195.8 -0.7C199.1 -1.9 201.6 -6.3 204.7 -7C207.9 -7.7 211.5 -5.9 214.6 -4.9C217.6 -4 220.1 -2.8 223.1 -1.4C226 0 230.7 0.9 232.4 3.4C234.2 5.8 232.3 10.5 233.6 13.4C234.8 16.4 240 18.5 239.8 21.1C239.5 23.6 233.3 25.7 231.9 28.8Z"/>
<path class="line-thin" d="M194 10C195.5 11.2 201.5 15.8 203 17"/>
<path class="line-thin" d="M216 6C216.5 7.8 218.5 15.2 219 17"/>
<path class="line-thin" d="M197 30C199 29.8 207 29.2 209 29"/>
<path class="line-thin" d="M222 26C223 25 227 21 228 20"/>
</g>
</g>
<g class="hat hat-cap">
<path class="f-team line" d="M56.4 113.5C51.3 108.7 54.6 89.2 58.4 77.9C62.1 66.6 67.6 54.4 79.2 45.6C90.8 36.7 107.6 29.8 127.9 24.7C148.2 19.6 176.9 15.3 200.9 15C224.9 14.7 252.4 18 272 22.9C291.6 27.8 306.7 35.4 318.5 44.4C330.2 53.4 338.5 65.5 342.6 76.8C346.8 88.2 348.5 107.4 343.2 112.5C338 117.5 313.9 124.5 289.9 127.6C265.9 130.8 229.4 131.5 199.3 131.2C169.3 131 133.4 129.1 109.6 126.2C85.8 123.2 61.6 118.3 56.4 113.5Z"/>
<path class="line-thin" d="M200 20C192 27.3 161 46.7 152 64C143 81.3 147 114 146 124"/>
<path class="line-thin" d="M200 20C208.3 27.3 240.7 46.3 250 64C259.3 81.7 255 115.7 256 126"/>
<path class="f-team-dark line" d="M56.2 105.8C60.7 105.6 86.1 113.1 110.1 115.8C134 118.6 170.1 121.8 200 122.2C230 122.6 265.8 121.1 289.8 118.1C313.8 115.1 339.4 104.4 344 104.2C348.5 104 353.1 111.9 344 115.9C335 119.8 313.8 125.4 289.8 128.1C265.8 130.8 230.2 132.2 200.2 131.9C170.3 131.5 134.2 128.5 110.2 126.2C86.1 123.8 64.9 121.2 55.9 117.8C46.9 114.4 51.7 105.9 56.2 105.8Z"/>
<circle class="f-team-dark line" cx="200" cy="16" r="8"/>
<g id="char-brim" class="flop" data-pivot="267 112" data-flop="brim">
<path class="f-team-dark line" d="M264.3 112.5C267.3 112.2 286.7 118.6 300.3 120.1C313.9 121.7 332.6 122.1 346.1 121.7C359.6 121.4 375.2 117 381.4 118C387.5 118.9 384.2 125.8 383 127.6C381.8 129.4 378 134.2 369.1 136C360.1 137.7 342 138.7 329.4 138C316.8 137.3 304.2 134 293.4 131.7C282.6 129.3 266.9 125.4 264.5 123.8C262.1 122.2 261.4 112.8 264.3 112.5Z"/>
<path class="f-team line" d="M262 104C264.5 102.2 283.2 98.1 295.1 95.7C306.9 93.4 321.2 90.2 333.2 89.9C345.2 89.6 358.5 91.3 366.9 93.9C375.3 96.6 382.3 103.1 383.7 105.7C385.2 108.3 385.2 118.2 381.3 120C377.5 121.8 359.2 123.6 345.7 124C332.1 124.3 313.5 123.1 300.2 122C286.8 121 268.6 119.3 265.4 117.8C262.2 116.3 259.5 105.9 262 104Z"/>
<path class="line-thin" d="M272 110C279.2 109.2 299.2 105.7 315 105C330.8 104.3 358.3 105.8 367 106"/>
</g>
</g>
</g>
<g id="char-steam">
<g class="steam steam-l" opacity="0"><path class="f-paper line" d="M13.9 -0.4C13.8 0.8 11.1 2.3 10 3.7C8.8 5.1 8.1 6.9 6.9 8.1C5.8 9.3 4.5 11 3 11.1C1.5 11.2 -0.3 9.1 -2.1 8.7C-4 8.2 -6.6 9.1 -8.2 8.5C-9.7 8 -11.2 6.7 -11.5 5.3C-11.9 3.9 -10.4 1.9 -10.3 0.2C-10.3 -1.5 -11.9 -3.2 -11.4 -4.7C-10.9 -6.2 -9 -8 -7.5 -8.7C-6 -9.4 -4.1 -8.4 -2.3 -8.9C-0.5 -9.4 1.7 -11.9 3.3 -11.7C4.9 -11.6 6.3 -9.3 7.4 -7.9C8.6 -6.6 9.3 -4.9 10.4 -3.6C11.4 -2.4 14 -1.6 13.9 -0.4Z"/></g>
<g class="steam steam-l" opacity="0"><path class="f-paper line" d="M8.6 12.3C6.9 13.6 4.4 14.6 2.3 14.4C0.2 14.3 -1.6 12.2 -4 11.5C-6.4 10.9 -10.3 11.7 -12.2 10.5C-14.1 9.4 -15.2 6.8 -15.5 4.7C-15.8 2.7 -13.8 0.6 -13.8 -1.6C-13.8 -3.8 -16.2 -6.9 -15.3 -8.5C-14.4 -10 -10.6 -10 -8.4 -10.8C-6.2 -11.6 -4.3 -12.3 -2 -13C0.4 -13.7 3.9 -15.7 5.9 -14.9C7.9 -14.2 8.6 -10.3 10.2 -8.6C11.7 -6.8 13.9 -5.9 15.2 -4.3C16.5 -2.7 18.4 -0.6 18 1.2C17.5 3 14 4.8 12.4 6.7C10.8 8.5 10.3 11 8.6 12.3Z"/></g>
<g class="steam steam-l" opacity="0"><path class="f-paper line" d="M-7.9 14.3C-10.7 13.5 -15.2 13.9 -17 12.2C-18.8 10.4 -18.3 6.3 -18.6 3.8C-18.8 1.3 -18.4 -0.2 -18.3 -2.8C-18.3 -5.4 -20 -9.9 -18.4 -11.8C-16.8 -13.7 -11.6 -13.3 -8.6 -14.1C-5.5 -14.9 -3.1 -16.1 0 -16.7C3 -17.2 7.2 -18.5 9.6 -17.3C11.9 -16 12.1 -11.3 13.9 -9.2C15.7 -7.1 19.2 -6.9 20.3 -4.7C21.4 -2.4 21.4 2 20.4 4.2C19.4 6.4 16.1 6.5 14.3 8.6C12.5 10.7 12.2 15.4 9.8 16.8C7.5 18.2 3.1 17.4 0.2 17C-2.8 16.6 -5 15.1 -7.9 14.3Z"/></g>
<g class="steam steam-r" opacity="0"><path class="f-paper line" d="M13.2 0C13.3 1.5 10.7 3.1 9.8 4.5C8.9 5.8 8.8 7.2 7.7 8.2C6.7 9.3 5 10.8 3.4 10.9C1.7 10.9 -0.6 9 -2.5 8.6C-4.3 8.1 -6 8.6 -7.5 8C-9 7.4 -10.9 6.5 -11.4 5.1C-11.9 3.6 -10.6 1.2 -10.6 -0.4C-10.6 -2 -12 -3.4 -11.6 -4.7C-11.2 -6 -9.7 -7.6 -8.1 -8.2C-6.5 -8.8 -3.9 -8 -2.1 -8.5C-0.3 -9 1 -11.6 2.5 -11.5C4 -11.4 5.9 -9.1 7 -7.9C8.2 -6.8 8.4 -5.9 9.4 -4.6C10.5 -3.3 13.2 -1.5 13.2 0Z"/></g>
<g class="steam steam-r" opacity="0"><path class="f-paper line" d="M9.3 12.1C7.7 13.4 4.6 14.7 2.4 14.6C0.1 14.5 -1.6 11.9 -4 11.3C-6.5 10.7 -10.4 12.1 -12.3 11C-14.1 9.8 -14.8 6.4 -15.1 4.4C-15.4 2.4 -14 0.9 -14 -1.2C-14 -3.3 -16.2 -6.7 -15.2 -8.3C-14.2 -9.8 -10.3 -9.9 -8.1 -10.7C-5.9 -11.5 -4.3 -12.4 -2 -13.1C0.4 -13.9 4.1 -15.8 6.2 -15.2C8.2 -14.6 9 -11.2 10.4 -9.5C11.8 -7.8 13.3 -6.9 14.5 -5C15.8 -3.1 18.2 0.1 17.8 2C17.4 3.9 13.5 4.6 12.1 6.3C10.7 8 11 10.7 9.3 12.1Z"/></g>
<g class="steam steam-r" opacity="0"><path class="f-paper line" d="M-6.9 14C-9.9 13.1 -15.7 14 -17.5 12.3C-19.4 10.6 -18 6.5 -18.1 3.9C-18.3 1.3 -18.4 -0.7 -18.4 -3.3C-18.3 -5.8 -19.5 -9.9 -17.8 -11.7C-16.2 -13.5 -11.3 -13.3 -8.4 -14.3C-5.6 -15.2 -3.7 -16.8 -0.7 -17.4C2.3 -18 7.3 -19 9.6 -17.7C12 -16.4 11.8 -11.8 13.6 -9.6C15.4 -7.4 19.1 -6.7 20.3 -4.5C21.6 -2.4 22.1 1 21.1 3.3C20 5.5 15.8 6.8 14 9.1C12.2 11.4 12.3 15.8 10 17.2C7.8 18.7 3.4 18.2 0.5 17.7C-2.3 17.1 -3.9 14.9 -6.9 14Z"/></g>
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
.rig .f-team{fill:var(--team)}
.rig .f-team-dark{fill:var(--team-dark)}
.rig .f-shadow{fill:var(--ink);opacity:.2}
.rig[data-team="left"]{--team:var(--red);--team-dark:var(--red-dark)}
.rig[data-team="right"]{--team:var(--blue);--team-dark:var(--blue-dark)}
.rig[data-team="left"] .hat-cap,.rig[data-team="right"] .hat-beanie{display:none}
.rig[data-variant="guy"] .gal-only,.rig[data-variant="gal"] .guy-only{display:none}
`;

  /* Tokens the rig paints with; inlined when exporting a standalone SVG. */
  const TOKENS = ['ink', 'paper', 'skin', 'flush', 'vein', 'mouth', 'tongue', 'pants', 'shoe', 'hair',
    'red', 'red-dark', 'blue', 'blue-dark'];

  /* The two fighters. `variant` picks the hair set: swap "guy" and "gal"
     here to put her on the left instead. Everything else is identical. */
  const TEAMS = {
    left: { id: 'left', name: 'LEFTY', side: 'LEFT', facing: 1, variant: 'guy' },
    right: { id: 'right', name: 'RIGHTY', side: 'RIGHT', facing: -1, variant: 'gal' },
  };

  /* Every animatable channel with its neutral value. Units: px / degrees in
     viewBox space; 0–1 for the normalised ones. "Forward" is always toward
     the opponent, whichever way the character faces on screen. */
  const BASE = Object.freeze({
    x: 0, y: 0, rot: 0, sx: 1, sy: 1, // whole character (feet stay the anchor)
    lean: 5, bodySY: 1,               // upper body lean (deg, + = forward) and squash
    legL: 0, legR: 0,                 // foot lift (px)
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
    hatY: 0, hatRot: 0, flop: 0,      // hat pop; pom-pom / brim / ponytail flop (-1…1)
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
   * @param {{state?: object, pose?: string, variant?: 'guy'|'gal', static?: boolean}} [opts]
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
    const steamL = [...svg.querySelectorAll('.steam-l')];
    const steamR = [...svg.querySelectorAll('.steam-r')];
    const spits = [...svg.querySelectorAll('.spit')];

    const piv = {
      upper: pivotOf(P.upper), armL: pivotOf(P.armL), armR: pivotOf(P.armR), head: pivotOf(P.head),
      eyes: pivotOf(P.eyes), browL: pivotOf(P.browL), browR: pivotOf(P.browR), mouth: pivotOf(P.mouth),
      hat: pivotOf(P.hat),
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
      setT(P.legL, `translate(0 ${r2(-s.legL)})`);
      setT(P.legR, `translate(0 ${r2(-s.legR)})`);
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
        if (kind === 'pom') setT(el, `translate(0 ${r2(-5 * k)}) ${around(p[0], p[1], 10 * k, 1, 1)}`);
        else if (kind === 'brim') setT(el, around(p[0], p[1], -5 * k, 1, 1));
        else setT(el, around(p[0], p[1], 14 * k, 1, 1)); // ponytail
      });

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
