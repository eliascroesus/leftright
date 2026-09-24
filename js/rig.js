/* ==========================================================================
   LEFT RIGHT — character rig
   --------------------------------------------------------------------------
   ONE SVG rig, drawn facing right. LEFTY (red, left) uses it as drawn;
   RIGHTY (blue, right) is the same rig mirrored and recoloured. The only
   differences between them are the team colour and the hat (beanie / cap).

   Parts (ids in RIG_MARKUP):
     #char-body  #char-head  #char-hat  #char-eyes  #char-pupils  #char-brows
     #char-mouth #char-arm-l #char-arm-r #char-legs
   Helpers:
     #char-root #char-upper (lean) #char-face #char-brow-l/-r #char-leg-l/-r
     #char-jaw #char-flush #char-veins #char-ears #char-steam #char-spit
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
<svg class="rig" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<g id="char-root">
<ellipse class="f-shadow" cx="208" cy="486" rx="112" ry="12"/>
<g id="char-legs" data-pivot="202 410">
<g id="char-leg-l" data-pivot="175 410">
<path class="f-pants line" d="M157.3 398.6C160.5 392.2 189.3 391.8 192.6 398.2C195.9 404.5 193.7 455.7 190.5 462.1C187.3 468.5 163.6 468.7 160.3 462.4C157 456 154.1 405 157.3 398.6Z"/>
<path class="f-paper line" d="M149.9 454.8C156.2 451.5 170.1 450.9 178.2 451.3C186.3 451.7 193.2 454.5 198.5 457.5C203.8 460.6 208.7 466.1 209.9 469.7C211.1 473.3 211.2 482.9 207.5 484.6C203.7 486.4 182.7 487.3 172.4 487.5C162.1 487.7 149.1 487.6 145.8 486C142.6 484.4 139.6 476.7 140.3 471.5C141 466.3 143.6 458.2 149.9 454.8Z"/>
<path class="line-thin" d="M143 477C148.5 477.5 165 480.2 176 480C187 479.8 203.5 476.7 209 476"/>
<path class="line-thin" d="M176 457C177.3 458.2 182.7 462.8 184 464"/>
<path class="line-thin" d="M186 456C187.2 457 191.8 461 193 462"/>
</g>
<g id="char-leg-r" data-pivot="229 410">
<path class="f-pants line" d="M211.9 398C215.2 391.4 242.7 391.5 246 397.9C249.3 404.4 248.1 456.1 244.9 462.6C241.7 469.2 217.2 470.2 213.9 463.7C210.6 457.2 208.7 404.6 211.9 398Z"/>
<path class="f-paper line" d="M209.7 455.4C216.1 451.8 230 450.8 238.1 451.1C246.1 451.3 252.9 454 258.2 457.1C263.4 460.2 268.3 466 269.5 469.7C270.8 473.5 271.4 483.5 267.6 485.4C263.9 487.2 242.3 487.9 232.1 488C221.9 488.2 209.6 487.8 206.4 486.3C203.2 484.7 199.4 477.5 200 472.3C200.5 467.2 203.4 458.9 209.7 455.4Z"/>
<path class="line-thin" d="M203 477C208.5 477.5 225 480.2 236 480C247 479.8 263.5 476.7 269 476"/>
<path class="line-thin" d="M236 457C237.3 458.2 242.7 462.8 244 464"/>
<path class="line-thin" d="M246 456C247.2 457 251.8 461 253 462"/>
</g>
</g>
<g id="char-upper" data-pivot="204 416">
<g id="char-arm-l" data-pivot="154 318">
<path class="f-team line" d="M164.5 301.9C160.7 297.9 142.1 299.4 131.6 299.6C121 299.7 107 299.8 101.4 302.9C95.8 306 97.7 312.9 97.9 318.2C98 323.4 96.9 331.5 102.5 334.5C108.2 337.5 121.7 336.5 132 336.4C142.3 336.3 160.6 337.9 164.4 333.8C168.2 329.8 168.4 305.9 164.5 301.9Z"/>
<path class="f-team-dark line" d="M108.4 301.2C106.7 299.6 96.1 300.2 94.3 301.9C92.5 303.6 90.6 312.8 90.6 318.2C90.6 323.7 92.4 333.1 94.2 334.8C95.9 336.5 106.2 336.8 107.9 335.2C109.6 333.5 111.1 323.6 111.2 317.9C111.2 312.2 110 302.8 108.4 301.2Z"/>
<path class="f-skin line" d="M93.5 305.8C90.4 301.1 83.2 296.9 77.6 295.8C72 294.7 64.1 296.7 59.7 299.4C55.3 302.1 52.6 307.2 51.2 312C49.9 316.8 49.1 323.7 51.6 328.1C54.1 332.5 60.4 337 66.1 338.5C71.9 340.1 81.2 339.7 86.2 337.3C91.2 334.9 95 329.3 96.2 324C97.4 318.8 96.6 310.5 93.5 305.8Z"/>
<path class="line-thin" d="M68 311C65.8 311.2 57.2 311.8 55 312"/>
<path class="line-thin" d="M68 320C65.5 320.2 55.5 320.8 53 321"/>
<path class="line-thin" d="M68 329C66 329.2 58 329.8 56 330"/>
<path class="line-thin" d="M88 312C86 311.3 79.3 308.2 76 308C72.7 307.8 69.3 310.5 68 311"/>
</g>
<g id="char-body" data-pivot="204 416">
<path class="f-team line" d="M145.5 300.3C152.2 293.8 166.1 293 176.1 291.4C186.1 289.8 195.8 290.7 205.4 290.7C215.1 290.7 224.7 290.2 234 291.3C243.4 292.4 255.4 290.8 261.7 297.2C267.9 303.6 268.9 317.7 271.4 329.8C274 341.9 275.6 357.9 276.9 369.9C278.3 381.9 280.8 396.2 279.6 401.8C278.5 407.5 275.9 416 267.2 418.5C258.5 420.9 225.7 422.6 204.9 422.8C184.2 423 151.5 422.3 142.6 419.8C133.7 417.3 130.1 407.4 128.7 401.4C127.4 395.4 129.7 380.6 130.9 368.7C132.2 356.8 133.9 341.4 136.3 330C138.8 318.6 138.9 306.7 145.5 300.3Z"/>
<path class="f-team-dark" d="M137.5 332.1C139.7 321.2 142 307.7 145.8 302.3C149.5 297 158.7 293.5 159.9 299.8C161.1 306 154.5 324.4 152.9 339.8C151.3 355.2 149.7 379.4 150.5 392.1C151.3 404.8 158.7 411.9 157.5 416.1C156.3 420.4 145.9 419.1 143.1 417.7C140.4 416.3 131.9 410.2 130.1 401.9C128.3 393.6 131.1 379.4 132.3 367.8C133.6 356.1 135.2 343 137.5 332.1Z"/>
<path class="f-team-dark line" d="M129.6 397.8C136 397.9 179.9 405.3 204.9 405.4C229.8 405.5 273.1 398.5 279.3 398.3C285.5 398.2 281.1 400.2 279.1 403.7C277 407.1 274.2 416.9 266.8 418.9C259.4 420.8 225.4 423.2 204.9 423.2C184.3 423.2 151 420.6 143.4 418.7C135.8 416.7 131.3 407.4 129 403.9C126.7 400.4 123.3 397.6 129.6 397.8Z"/>
<path class="line-thin" d="M217.3 300.4C217.4 310.4 217.9 341.1 217.9 360.3C217.9 379.6 217.5 406.5 217.4 415.8"/>
<path class="f-paper line" d="M210.8 320C211.9 318.3 222.7 318.3 223.7 320C224.8 321.7 225 338.4 223.9 340.1C222.9 341.8 212.2 342 211.1 340.3C210 338.6 209.8 321.7 210.8 320Z"/>
<path class="line-thin" d="M149 374C153 373.2 169 369.8 173 369"/>
<path class="line-thin" d="M240 369C244 369.8 260 373.2 264 374"/>
</g>
<g id="char-arm-r" data-pivot="250 318">
<path class="f-team line" d="M240 302.1C243.8 298.2 261.8 300.4 272.2 300.5C282.6 300.5 296.9 299.5 302.4 302.5C308 305.4 305.6 313 305.6 318.2C305.6 323.3 308.2 330.4 302.6 333.4C297 336.4 282.4 336 272 336.2C261.6 336.3 243.9 338.4 240.2 334.4C236.5 330.4 236.3 306.1 240 302.1Z"/>
<path class="f-team-dark line" d="M295.7 300.7C297.4 299 308.3 300.2 310 301.9C311.7 303.7 312.6 312.8 312.7 318.3C312.7 323.9 312 333.5 310.3 335.2C308.6 336.8 297.7 336.6 296 335C294.3 333.3 293 324.1 292.9 318.4C292.9 312.6 294 302.3 295.7 300.7Z"/>
<path class="f-skin line" d="M309.7 306.2C312.8 301.5 320.4 296.9 326.2 295.7C331.9 294.4 339.7 296.1 344.2 298.9C348.6 301.7 351.6 307.5 352.8 312.3C354.1 317.1 354.1 323.3 351.7 327.7C349.3 332.1 344.1 337.3 338.5 338.9C332.8 340.4 323.2 339.3 318 336.8C312.9 334.3 309 328.9 307.6 323.8C306.2 318.7 306.6 310.9 309.7 306.2Z"/>
<path class="line-thin" d="M336 311C338.2 311.2 346.8 311.8 349 312"/>
<path class="line-thin" d="M336 320C338.5 320.2 348.5 320.8 351 321"/>
<path class="line-thin" d="M336 329C338 329.2 346 329.8 348 330"/>
<path class="line-thin" d="M316 312C318 311.3 324.7 308.2 328 308C331.3 307.8 334.7 310.5 336 311"/>
</g>
<g id="char-head" data-pivot="204 292">
<g id="char-ears">
<path class="f-skin line" d="M101.2 204.2C100 209.3 97.2 214.2 93.7 217.2C90.2 220.2 84.4 222.3 80.1 222.4C75.7 222.5 71 220.6 67.5 217.7C64 214.8 60.6 210 59.3 205C58 200 58.3 192.9 59.6 187.8C60.8 182.7 63.6 177.4 66.9 174.3C70.3 171.3 75.4 169.4 79.7 169.4C83.9 169.4 88.9 171.2 92.4 174.1C95.9 177.1 99 181.9 100.5 186.9C101.9 192 102.3 199.2 101.2 204.2Z"/>
<path class="f-skin line" d="M341.7 196.5C340.7 201.1 339.1 206.8 336.7 209.6C334.3 212.5 330.4 213.7 327.2 213.7C324 213.8 320.4 212.5 317.8 209.8C315.1 207.1 312.4 202 311.3 197.6C310.3 193.1 310.4 187.9 311.4 183.4C312.4 178.9 314.6 173.3 317.2 170.4C319.9 167.6 324.1 166.3 327.3 166.2C330.4 166.1 333.5 167.2 336 169.8C338.5 172.4 341.6 177.5 342.5 182C343.5 186.4 342.7 191.9 341.7 196.5Z"/>
<g class="flush" opacity="0"><path class="f-flush line" d="M101.2 204.2C100 209.3 97.2 214.2 93.7 217.2C90.2 220.2 84.4 222.3 80.1 222.4C75.7 222.5 71 220.6 67.5 217.7C64 214.8 60.6 210 59.3 205C58 200 58.3 192.9 59.6 187.8C60.8 182.7 63.6 177.4 66.9 174.3C70.3 171.3 75.4 169.4 79.7 169.4C83.9 169.4 88.9 171.2 92.4 174.1C95.9 177.1 99 181.9 100.5 186.9C101.9 192 102.3 199.2 101.2 204.2Z"/><path class="f-flush line" d="M341.7 196.5C340.7 201.1 339.1 206.8 336.7 209.6C334.3 212.5 330.4 213.7 327.2 213.7C324 213.8 320.4 212.5 317.8 209.8C315.1 207.1 312.4 202 311.3 197.6C310.3 193.1 310.4 187.9 311.4 183.4C312.4 178.9 314.6 173.3 317.2 170.4C319.9 167.6 324.1 166.3 327.3 166.2C330.4 166.1 333.5 167.2 336 169.8C338.5 172.4 341.6 177.5 342.5 182C343.5 186.4 342.7 191.9 341.7 196.5Z"/></g>
<path class="line-thin" d="M81 182C79.3 184.2 71.3 190.2 71 195C70.7 199.8 77.7 208.3 79 211"/>
<path class="line-thin" d="M330 178C331.2 180 336.8 185.8 337 190C337.2 194.2 332 200.8 331 203"/>
</g>
<path class="f-skin line" d="M323.6 201.2C320.6 215.6 313.3 230.5 304.6 242.7C295.8 254.9 283.6 266.4 271 274.5C258.5 282.7 244.3 288.6 229.3 291.5C214.2 294.3 196.1 294.6 180.8 291.7C165.6 288.8 150.8 282.2 137.8 274C124.8 265.8 111.3 254.8 102.8 242.4C94.4 230.1 89.8 214.4 87.2 199.8C84.6 185.2 84.2 169.4 87.1 154.7C90 139.9 96 123.5 104.6 111.2C113.2 98.9 125.7 88.9 138.7 81C151.7 73 167.7 66.6 182.7 63.6C197.7 60.5 213.9 59.7 228.7 62.5C243.4 65.4 258.3 72 271.2 80.6C284.1 89.2 297.5 101.8 306.1 114.3C314.7 126.9 319.9 141.6 322.9 156.1C325.8 170.5 326.7 186.7 323.6 201.2Z"/>
<g id="char-flush" opacity="0"><path class="f-flush line" d="M323.6 201.2C320.6 215.6 313.3 230.5 304.6 242.7C295.8 254.9 283.6 266.4 271 274.5C258.5 282.7 244.3 288.6 229.3 291.5C214.2 294.3 196.1 294.6 180.8 291.7C165.6 288.8 150.8 282.2 137.8 274C124.8 265.8 111.3 254.8 102.8 242.4C94.4 230.1 89.8 214.4 87.2 199.8C84.6 185.2 84.2 169.4 87.1 154.7C90 139.9 96 123.5 104.6 111.2C113.2 98.9 125.7 88.9 138.7 81C151.7 73 167.7 66.6 182.7 63.6C197.7 60.5 213.9 59.7 228.7 62.5C243.4 65.4 258.3 72 271.2 80.6C284.1 89.2 297.5 101.8 306.1 114.3C314.7 126.9 319.9 141.6 322.9 156.1C325.8 170.5 326.7 186.7 323.6 201.2Z"/></g>
<g id="char-veins">
<g class="vein" data-pivot="233 120"><path class="f-vein line-soft" d="M226.7 118.5C225.4 119.7 227.5 119.7 228 120.5C228.5 121.2 229.2 122.3 229.7 123.1C230.2 123.9 230.8 125 231.1 125.6C231.4 126.1 231.6 126.4 231.6 126.6C231.6 126.9 231.7 126.8 231.3 127.3C231 127.7 230.4 128.5 229.7 129.3C229.1 130.2 228 131.2 227.4 132.5C226.8 133.8 226.1 135.6 226.2 137.1C226.2 138.6 227 140.3 227.7 141.6C228.4 143 229.4 144.1 230.3 145.2C231.1 146.3 232.1 147.3 232.8 148.1C233.5 148.9 233.3 150.4 234.4 150C235.6 149.6 239 147 239.6 146C240.2 145 238.7 144.7 238.1 143.9C237.5 143.1 236.6 142 236 141C235.3 140.1 234.6 139 234.3 138.3C233.9 137.6 233.8 137.2 233.8 136.9C233.8 136.6 233.9 136.8 234.3 136.4C234.7 136.1 235.3 135.4 236 134.7C236.7 133.9 237.9 133 238.6 131.8C239.3 130.6 240.2 128.9 240.4 127.4C240.6 125.8 240.1 124 239.7 122.6C239.3 121.1 238.6 119.8 238 118.7C237.5 117.5 236.8 116.4 236.3 115.5C235.9 114.7 236.9 113 235.3 113.5C233.7 114 227.9 117.3 226.7 118.5Z"/><path class="f-vein line-soft" d="M235.1 131.6C235.8 132.7 236.3 131.1 237.1 130.8C237.9 130.5 239 130.2 240.1 129.8C241.1 129.4 242.4 128.9 243.5 128.4C244.6 127.9 245.7 127.3 246.7 126.6C247.7 126 248.5 125.1 249.4 124.3C250.2 123.5 251 122.5 251.7 121.7C252.5 120.8 253.1 120 253.6 119.3C254.1 118.6 255.3 118.5 254.9 117.7C254.5 116.8 252 114.7 251.1 114.3C250.3 114 250.2 115.2 249.6 115.8C249.1 116.4 248.3 117.1 247.6 117.8C246.9 118.5 246.1 119.3 245.4 119.9C244.7 120.5 244.1 120.9 243.3 121.4C242.6 121.8 241.8 122 240.9 122.3C240 122.7 238.9 123 237.9 123.2C237 123.5 235.9 123.7 235 123.9C234.2 124.1 232.9 123.1 232.9 124.4C232.9 125.7 234.4 130.5 235.1 131.6Z"/></g>
<g class="vein" data-pivot="132 136"><path class="f-vein line-soft" d="M126.5 136.4C125.5 137.5 127.4 137.6 127.9 138.3C128.5 139.1 129.3 140.1 129.9 140.9C130.5 141.8 131.2 142.8 131.6 143.5C132 144.2 132.2 144.6 132.3 145.1C132.3 145.5 132.2 145.7 132 146.2C131.7 146.8 131.1 147.7 130.6 148.6C130 149.5 129.1 150.6 128.7 151.9C128.2 153.1 127.7 154.7 127.8 156.1C127.8 157.5 128.4 159 129 160.3C129.6 161.5 130.4 162.7 131.2 163.8C131.9 164.9 132.7 165.9 133.3 166.7C133.9 167.4 133.7 168.7 134.7 168.5C135.7 168.3 138.7 166.3 139.3 165.5C139.8 164.6 138.5 164.2 138 163.4C137.5 162.6 136.8 161.5 136.2 160.6C135.7 159.6 135.1 158.5 134.7 157.8C134.4 157 134.2 156.4 134.2 155.9C134.3 155.4 134.4 155.2 134.8 154.6C135.2 154.1 135.8 153.3 136.4 152.4C137.1 151.5 138 150.5 138.6 149.3C139.1 148 139.7 146.4 139.7 144.9C139.8 143.4 139.2 141.8 138.7 140.4C138.2 139.1 137.4 137.8 136.7 136.7C136 135.5 135.3 134.5 134.7 133.6C134.2 132.8 134.9 131.2 133.5 131.6C132.1 132.1 127.4 135.3 126.5 136.4Z"/></g>
</g>
<g id="char-face">
<g id="char-eyes" data-pivot="228 170">
<path class="f-paper line" d="M207.9 177.3C206.6 179.9 204 182.4 201.5 184C199 185.6 195.7 186.9 192.8 186.7C189.9 186.5 186.3 184.7 184 182.9C181.7 181 179.6 178.4 178.9 175.6C178.3 172.7 178.9 168.6 180.1 165.9C181.3 163.3 183.6 161 186.1 159.6C188.7 158.2 192.6 157.3 195.5 157.6C198.4 157.9 201.5 159.4 203.8 161.2C206.1 163 208.7 165.7 209.4 168.4C210.1 171.1 209.2 174.7 207.9 177.3Z"/>
<path class="f-paper line" d="M275.1 174.9C274 177.4 271.9 179.7 269.6 181.1C267.3 182.4 264 183.4 261.3 183C258.5 182.7 255.2 180.9 253 179.1C250.8 177.3 248.8 174.8 248 172.2C247.2 169.5 247.1 165.8 248.2 163.3C249.3 160.8 252.2 158.8 254.7 157.3C257.3 155.9 260.8 154.5 263.5 154.7C266.3 154.9 269.1 156.5 271.2 158.4C273.3 160.3 275.3 163.5 275.9 166.2C276.6 169 276.1 172.4 275.1 174.9Z"/>
<g id="char-pupils"><circle class="f-ink" cx="199" cy="173" r="6.6"/><circle class="f-ink" cx="266" cy="170" r="6.4"/></g>
</g>
<g id="char-brows">
<g id="char-brow-l" data-pivot="191 151"><path class="f-ink" d="M164.1 144.3C166.4 143.4 180.7 144.7 189.6 146.5C198.4 148.2 214.7 152.6 217.3 154.7C219.8 156.7 217.7 166.4 215 166.8C212.3 167.2 198.5 161 190.3 159.1C182.2 157.2 168.8 156.8 166.2 155.3C163.5 153.9 161.8 145.2 164.1 144.3Z"/></g>
<g id="char-brow-r" data-pivot="268 156"><path class="f-ink" d="M243.2 158.3C245.4 156.1 260.3 153.1 268.4 149.9C276.4 146.7 289.1 138.8 291.6 139.1C294.1 139.3 295.4 150 293.3 152.4C291.1 154.7 277.6 159.6 269.7 162.8C261.7 166 248.2 171.9 245.5 171.5C242.9 171 240.9 160.4 243.2 158.3Z"/></g>
</g>
<path class="f-skin-dark line" d="M264.6 201C264.1 203.3 261.7 206.2 259.2 207.5C256.7 208.8 252.6 209.5 249.7 209C246.7 208.6 243.1 206.6 241.4 204.6C239.7 202.6 238.9 199.3 239.5 196.9C240.1 194.6 242.5 192 245 190.7C247.4 189.4 251.2 188.7 254.1 189.2C257 189.7 260.8 191.9 262.6 193.9C264.3 195.8 265.2 198.7 264.6 201Z"/>
<g id="char-mouth" data-pivot="247 214">
<clipPath id="char-mouth-clip"><use href="#char-mouth-cavity"/></clipPath>
<path id="char-mouth-cavity" class="f-mouth" d="M184 228C184.9 225.4 193.5 221.3 200 219C206.5 216.7 215.2 215.2 223 214C230.8 212.8 239 212.2 247 212C255 211.8 263.5 212.3 271 213C278.5 213.7 285.7 214.5 292 216C298.3 217.5 307.9 219.7 309 222C310.1 224.3 308 237.8 306 247C304 256.2 301.2 267.7 297 277C292.8 286.3 287.3 296.2 281 303C274.7 309.8 266.5 315.5 259 318C251.5 320.5 243.5 320.2 236 318C228.5 315.8 220.3 311.2 214 305C207.7 298.8 202.3 289.7 198 281C193.7 272.3 190.3 261.8 188 253C185.7 244.2 183.1 230.6 184 228Z"/>
<g clip-path="url(#char-mouth-clip)">
<g id="char-jaw">
<path class="f-tongue line" d="M282.8 294.2C282.8 297 280.6 300.4 277 302.7C273.3 304.9 266.9 306.9 261.1 307.6C255.4 308.3 248.1 307.8 242.3 306.9C236.6 306 230.3 304.2 226.7 302.2C223.2 300.1 221 297.2 221 294.5C221 291.8 223.1 288.2 226.7 286C230.3 283.7 236.8 281.8 242.5 280.9C248.3 280 255.5 279.9 261.2 280.7C267 281.6 273.5 283.8 277.1 286C280.6 288.3 282.8 291.4 282.8 294.2Z"/>
<path class="line-thin" d="M252 286C252.2 288.3 252.8 297.7 253 300"/>
<path class="f-paper line" d="M203.8 334.2C189.7 329.3 205.9 311 211.3 304.8C216.7 298.6 227.6 298.4 236.1 297.1C244.6 295.7 253.5 295.5 262.3 296.8C271.1 298.1 283.3 298.8 288.9 305C294.5 311.3 310.2 329.3 296 334.1C281.8 339 217.9 339.1 203.8 334.2Z"/>
<path class="line-thin" d="M236 298C236 301 236 313 236 316"/>
<path class="line-thin" d="M262 298C262 301 262 313 262 316"/>
</g>
<path class="f-paper line" d="M180.2 214C187 208.7 211.6 207.8 222.7 206.1C233.9 204.5 238.9 204.4 247.1 204.2C255.3 204 261 203.5 272.2 204.8C283.4 206.1 307.6 207.9 314.3 211.9C321 215.9 315.9 226.5 312.2 228.8C308.5 231.2 298.8 226.4 292.1 225.7C285.4 225.1 279.7 225 272.2 224.9C264.7 224.8 255.2 224.8 247 225.2C238.8 225.5 231.3 225.5 223.1 227C214.9 228.5 204.8 232.3 198 234.2C191.2 236 185.2 241.5 182.3 238.1C179.3 234.8 173.5 219.3 180.2 214Z"/>
<path class="line-thin" d="M219 212C219 214.7 219 225.4 219 228"/>
<path class="line-thin" d="M242 212C242 214.2 242 223.2 242 225.4"/>
<path class="line-thin" d="M265 212C265 214.2 265 222.8 265 225"/>
<path class="line-thin" d="M287 212C287 214.4 287 224 287 226.4"/>
</g>
<path id="char-mouth-line" class="line f-none" d="M184 228C184.9 225.4 193.5 221.3 200 219C206.5 216.7 215.2 215.2 223 214C230.8 212.8 239 212.2 247 212C255 211.8 263.5 212.3 271 213C278.5 213.7 285.7 214.5 292 216C298.3 217.5 307.9 219.7 309 222C310.1 224.3 308 237.8 306 247C304 256.2 301.2 267.7 297 277C292.8 286.3 287.3 296.2 281 303C274.7 309.8 266.5 315.5 259 318C251.5 320.5 243.5 320.2 236 318C228.5 315.8 220.3 311.2 214 305C207.7 298.8 202.3 289.7 198 281C193.7 272.3 190.3 261.8 188 253C185.7 244.2 183.1 230.6 184 228Z"/>
</g>
<g id="char-spit"><g class="spit"><path class="f-paper line-soft" d="M4.9 -0.2C4.9 1 3.4 3 2.2 3.6C1 4.3 -1 4.2 -2.2 3.6C-3.4 3.1 -4.9 1.4 -4.9 0.2C-5 -1 -3.5 -3.1 -2.3 -3.7C-1 -4.3 1.4 -4 2.6 -3.4C3.8 -2.8 5 -1.4 4.9 -0.2Z"/></g><g class="spit"><path class="f-paper line-soft" d="M4.3 0.1C4.4 1 3.3 2 2.3 2.5C1.2 3 -0.9 3.4 -2 3C-3 2.5 -4.2 0.8 -4.3 -0.2C-4.3 -1.2 -3.2 -2.5 -2.2 -2.9C-1.1 -3.4 0.7 -3.4 1.8 -2.9C2.8 -2.4 4.2 -0.8 4.3 0.1Z"/></g><g class="spit"><path class="f-paper line-soft" d="M5.9 0C5.9 1.5 4.7 3.6 3.3 4.4C1.8 5.1 -1.3 5 -2.9 4.3C-4.5 3.6 -6.2 1.5 -6.2 0.1C-6.2 -1.3 -4.4 -3.4 -2.8 -4.1C-1.3 -4.9 1.8 -5.1 3.2 -4.4C4.7 -3.7 5.9 -1.4 5.9 0Z"/></g><g class="spit"><path class="f-paper line-soft" d="M3.8 0.2C3.7 0.9 2.5 1.9 1.6 2.3C0.6 2.8 -1.1 3 -1.9 2.6C-2.8 2.3 -3.7 0.8 -3.6 0C-3.6 -0.8 -2.4 -1.8 -1.5 -2.2C-0.6 -2.6 1.1 -2.6 2 -2.2C2.9 -1.8 3.8 -0.6 3.8 0.2Z"/></g></g>
</g>
<g id="char-hat" data-pivot="205 112">
<g class="hat hat-beanie">
<g id="char-beanie-flop" class="hat-flop" data-pivot="205 96">
<path class="f-team line" d="M325.2 97.9C330.8 94.6 328.5 76.3 325.6 66.4C322.7 56.5 316.6 46.8 307.8 38.6C299 30.4 287.1 21.9 272.7 17.1C258.3 12.3 238.7 11.2 221.4 9.7C204.1 8.2 185.4 6.9 168.9 8.3C152.3 9.6 136.2 13.5 122.1 17.6C108 21.7 95.2 26.3 84.5 33C73.7 39.7 63.8 48.7 57.7 57.5C51.7 66.4 49.1 77 48 85.9C47 94.8 48.5 105.2 51.4 110.9C54.2 116.6 62.5 119.9 65.4 119.9C68.3 119.9 76.7 114.7 80.2 111C83.8 107.3 81.8 99.2 86.8 97.7C91.9 96.2 110.6 95.6 130.4 96.2C150.2 96.7 182.4 100.4 205.6 100.9C228.8 101.4 249.9 99.5 269.8 99C289.7 98.5 319.7 101.1 325.2 97.9Z"/>
<path class="line-thin" d="M128 20C123.3 25 106 39.3 100 50C94 60.7 93.3 78.3 92 84"/>
<path class="line-thin" d="M68 70C67.3 74.7 64.7 93.3 64 98"/>
<path class="line-thin" d="M186 12C183.7 17.3 174 32.7 172 44C170 55.3 173.7 74 174 80"/>
<path class="line-thin" d="M266 26C267.7 30.3 274.7 43 276 52C277.3 61 274.3 75.3 274 80"/>
</g>
<path class="f-team-dark line" d="M85.8 83.7C89.7 82.1 110.4 90.1 130.3 92.6C150.2 95.1 181.7 98.3 205.1 98.7C228.4 99 250.6 97.7 270.3 94.9C290 92 318.8 80.1 323.4 81.4C328 82.7 330.1 107 325.6 110.5C321.2 114 290.1 120.5 270 123.2C249.9 125.9 228.4 127 204.9 126.6C181.5 126.3 149.7 123.6 129.5 121.1C109.2 118.6 87.1 114.8 83.5 111.6C79.8 108.5 81.9 85.3 85.8 83.7Z"/>
<path class="line-thin" d="M100 91.5C100.2 94.6 100.8 107 101 110.1"/>
<path class="line-thin" d="M117 94.6C117.2 97.8 117.8 110.3 118 113.5"/>
<path class="line-thin" d="M134 97.3C134.2 100.5 134.8 113.1 135 116.3"/>
<path class="line-thin" d="M151 98.7C151.2 101.8 151.8 114.3 152 117.4"/>
<path class="line-thin" d="M168 100C168.2 103.1 168.8 115.5 169 118.5"/>
<path class="line-thin" d="M185 101.4C185.2 104.4 185.8 116.6 186 119.7"/>
<path class="line-thin" d="M202 102.8C202.2 105.8 202.8 117.8 203 120.8"/>
<path class="line-thin" d="M219 102.4C219.2 105.4 219.8 117.4 220 120.4"/>
<path class="line-thin" d="M236 101.6C236.2 104.6 236.8 116.6 237 119.6"/>
<path class="line-thin" d="M253 100.8C253.2 103.8 253.8 115.8 254 118.8"/>
<path class="line-thin" d="M270 100C270.2 103 270.8 115 271 118"/>
<path class="line-thin" d="M287 95.9C287.2 98.9 287.8 111 288 114.1"/>
<path class="line-thin" d="M304 91.8C304.2 94.9 304.8 107.1 305 110.1"/>
</g>
<g class="hat hat-cap">
<path class="f-team line" d="M83.6 111.7C78.8 107.6 79.9 91 81.9 80C83.9 68.9 86.5 55 95.6 45.3C104.6 35.6 117.8 27.5 136.2 21.9C154.6 16.3 183.8 12.2 205.8 11.9C227.8 11.5 251 14.2 268.2 19.6C285.3 25 299.1 34.2 308.6 44.1C318.1 53.9 322.3 67.7 325.3 78.6C328.3 89.4 332.1 104.9 326.6 109.3C321.2 113.7 291.1 119.8 270.7 122.6C250.3 125.4 227.7 126.3 204.3 126.1C180.9 125.9 150.5 123.5 130.4 121.1C110.2 118.7 88.5 115.8 83.6 111.7Z"/>
<path class="line-thin" d="M205 18C197.2 24.3 167.8 39.3 158 56C148.2 72.7 148 107.7 146 118"/>
<path class="line-thin" d="M205 18C212.2 24.7 238.5 41 248 58C257.5 75 259.7 109.7 262 120"/>
<path class="f-team-dark line" d="M83.7 103.9C87.6 104 109.8 110.4 130 112.7C150.2 115 181.8 117.5 205.1 117.9C228.4 118.3 249.8 117.7 270 115.1C290.1 112.5 321.4 102.7 326.1 102.3C330.8 101.9 330.9 108.3 326.2 110C321.5 111.7 290.1 120.1 269.8 122.8C249.6 125.5 228.1 126.4 204.7 126.1C181.4 125.7 150 123.1 129.9 120.7C109.7 118.4 87.7 113.3 83.9 111.9C80 110.5 79.9 103.9 83.7 103.9Z"/>
<circle class="f-team-dark line" cx="205" cy="14" r="8"/>
<g id="char-cap-flop" class="hat-flop" data-pivot="262 108">
<path class="f-team-dark line" d="M253.6 114.1C257.2 112.8 284.3 112.6 299.8 111.9C315.2 111.3 331.7 109.7 346.1 110.3C360.5 111 377.5 113 386.2 115.9C394.9 118.8 398.6 125.2 398.3 127.6C398.1 130.1 393.7 137.9 384 140.4C374.3 143 354.9 143.1 339.9 142.8C324.9 142.4 308 140.7 294 138.2C280 135.7 259.3 129.7 255.9 127.7C252.5 125.7 249.9 115.4 253.6 114.1Z"/>
<path class="f-team line" d="M252.4 105.7C255.5 103.7 277.9 99.4 292.2 96.5C306.4 93.6 323.6 89.3 337.9 88.3C352.2 87.4 367.8 88.5 378.1 91C388.5 93.5 398.2 100.5 400 103.5C401.8 106.6 400.8 119.2 396.2 121.5C391.7 123.9 370.1 126.5 354.4 126.9C338.7 127.3 318.6 124.9 302.1 123.8C285.7 122.7 260.1 122 256 120.5C251.8 119 249.4 107.7 252.4 105.7Z"/>
<path class="line-thin" d="M270 111C278.7 110.2 303.3 106.5 322 106C340.7 105.5 372 107.7 382 108"/>
</g>
</g>
</g>
<g id="char-steam">
<g class="steam steam-l" opacity="0"><path class="f-paper line" d="M14 0.2C14 1.5 11.3 2.7 10.1 4C9 5.3 8 6.8 6.8 8C5.7 9.2 4.7 10.8 3.2 11C1.6 11.3 -0.7 9.8 -2.5 9.3C-4.3 8.8 -6.1 8.8 -7.6 8C-9.1 7.2 -11 5.9 -11.5 4.6C-11.9 3.3 -10.2 1.6 -10.3 -0.1C-10.4 -1.7 -12.5 -3.7 -12.1 -5.1C-11.7 -6.4 -9.4 -7.3 -7.7 -8C-6 -8.7 -3.7 -8.9 -1.9 -9.4C-0.1 -9.8 1.4 -11.1 3 -10.8C4.6 -10.5 6.3 -8.8 7.5 -7.6C8.7 -6.5 9.2 -5 10.3 -3.7C11.3 -2.4 14 -1.1 14 0.2Z"/></g>
<g class="steam steam-l" opacity="0"><path class="f-paper line" d="M8.6 12.2C6.9 13.7 4.3 14.7 2 14.5C-0.2 14.3 -2.4 11.6 -4.8 11C-7.2 10.3 -10.7 11.9 -12.4 10.8C-14.1 9.7 -14.7 6.5 -15 4.4C-15.3 2.4 -14 0.5 -14 -1.5C-14.1 -3.6 -16.1 -6.2 -15.3 -7.8C-14.4 -9.3 -10.9 -10.2 -8.7 -10.9C-6.5 -11.7 -4.3 -11.6 -1.9 -12.3C0.6 -13 3.9 -15.5 5.8 -14.9C7.8 -14.4 8.4 -10.5 9.9 -8.8C11.5 -7.1 13.8 -6.6 15.1 -4.8C16.5 -3 18.6 0 18 1.8C17.5 3.6 13.5 4.2 11.9 6C10.3 7.7 10.2 10.8 8.6 12.2Z"/></g>
<g class="steam steam-l" opacity="0"><path class="f-paper line" d="M-7.1 14.4C-9.9 13.6 -15.1 14.2 -17 12.5C-18.9 10.7 -18.3 6.3 -18.4 3.7C-18.6 1.1 -18 -0.6 -17.9 -3.3C-17.8 -6 -19.6 -10.5 -17.9 -12.2C-16.3 -14 -11.1 -13.2 -8.1 -14C-5.1 -14.8 -3 -16.4 0 -17C3 -17.6 7.5 -18.9 9.7 -17.7C11.8 -16.5 11.2 -12 13 -9.8C14.8 -7.6 18.9 -6.5 20.3 -4.3C21.6 -2.1 22 1.2 21 3.5C19.9 5.7 15.9 6.8 14 9C12.2 11.2 12.1 15.4 9.8 16.7C7.4 18.1 3 17.5 0.1 17.1C-2.7 16.8 -4.2 15.2 -7.1 14.4Z"/></g>
<g class="steam steam-r" opacity="0"><path class="f-paper line" d="M13.9 0C13.8 1.4 10.7 2.8 9.6 4.1C8.5 5.4 8.5 6.7 7.4 7.9C6.4 9 5 10.9 3.4 11C1.8 11.1 -0.2 9 -2 8.5C-3.9 8 -6 8.5 -7.7 7.9C-9.4 7.3 -11.6 6.4 -12 5.1C-12.5 3.8 -10.5 1.6 -10.4 -0.1C-10.3 -1.8 -11.8 -3.7 -11.5 -5.1C-11.1 -6.4 -9.7 -7.5 -8.2 -8.1C-6.6 -8.6 -4.1 -7.9 -2.2 -8.4C-0.3 -8.9 1.5 -11.2 3.1 -11.1C4.7 -10.9 6.4 -8.8 7.6 -7.7C8.8 -6.6 9.1 -5.8 10.2 -4.5C11.2 -3.3 14 -1.5 13.9 0Z"/></g>
<g class="steam steam-r" opacity="0"><path class="f-paper line" d="M9 12C7.4 13.3 4.6 14.3 2.4 14.2C0.2 14.1 -1.9 11.8 -4.3 11.3C-6.6 10.8 -9.8 12.2 -11.7 11.2C-13.7 10.1 -15.4 7.1 -15.7 5C-16.1 2.9 -14 0.7 -13.9 -1.5C-13.7 -3.6 -15.8 -6.3 -14.8 -7.9C-13.9 -9.5 -10.5 -10.5 -8.3 -11.3C-6.2 -12.1 -4.3 -12 -1.9 -12.7C0.5 -13.3 4.1 -15.6 6.1 -15.1C8.1 -14.5 8.7 -11.2 10.2 -9.3C11.6 -7.5 13.4 -6 14.7 -4.2C15.9 -2.5 18 -0.5 17.6 1.2C17.1 2.9 13.5 4.3 12.1 6.1C10.7 7.9 10.6 10.6 9 12Z"/></g>
<g class="steam steam-r" opacity="0"><path class="f-paper line" d="M-7.4 14.3C-10.3 13.6 -15 14.4 -16.8 12.6C-18.6 10.8 -18.1 6.2 -18.3 3.6C-18.5 1 -17.8 -0.4 -17.8 -2.9C-17.8 -5.4 -20 -9.6 -18.4 -11.4C-16.7 -13.3 -10.9 -13.1 -7.9 -14.1C-4.9 -15 -3.3 -16.7 -0.4 -17.2C2.4 -17.6 6.9 -18.1 9.1 -16.9C11.4 -15.6 11.2 -11.7 13 -9.6C14.8 -7.6 18.5 -6.8 19.9 -4.5C21.3 -2.2 22.2 1.8 21.3 4.1C20.3 6.3 16 7 14.2 9.2C12.3 11.4 12.5 15.9 10.3 17.2C8 18.6 3.4 17.6 0.5 17.1C-2.5 16.6 -4.6 15.1 -7.4 14.3Z"/></g>
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
.rig{overflow:visible;--ow:4px}
.rig .line{stroke:var(--ink);stroke-width:var(--ow);vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.rig .line-thin{fill:none;stroke:var(--ink);stroke-width:calc(var(--ow) * .55);vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.rig .line-soft{stroke:var(--ink);stroke-width:calc(var(--ow) * .55);vector-effect:non-scaling-stroke;stroke-linejoin:round}
.rig .f-none{fill:none}
.rig .f-ink{fill:var(--ink)}
.rig .f-paper{fill:var(--paper)}
.rig .f-skin{fill:var(--skin)}
.rig .f-skin-dark{fill:var(--skin-dark)}
.rig .f-flush{fill:var(--flush)}
.rig .f-vein{fill:var(--vein)}
.rig .f-mouth{fill:var(--mouth)}
.rig .f-tongue{fill:var(--tongue)}
.rig .f-pants{fill:var(--pants)}
.rig .f-team{fill:var(--team)}
.rig .f-team-dark{fill:var(--team-dark)}
.rig .f-team-light{fill:var(--team-light)}
.rig .f-shadow{fill:var(--ink);opacity:.2}
.rig[data-team="left"]{--team:var(--red);--team-dark:var(--red-dark);--team-light:var(--red-light)}
.rig[data-team="right"]{--team:var(--blue);--team-dark:var(--blue-dark);--team-light:var(--blue-light)}
.rig[data-team="left"] .hat-cap,.rig[data-team="right"] .hat-beanie{display:none}
`;

  /* Tokens the rig paints with; inlined when exporting a standalone SVG. */
  const TOKENS = ['ink', 'paper', 'paper-2', 'skin', 'skin-dark', 'flush', 'vein', 'mouth', 'tongue', 'pants',
    'red', 'red-dark', 'red-light', 'blue', 'blue-dark', 'blue-light'];

  const TEAMS = {
    left: { id: 'left', name: 'LEFTY', side: 'LEFT', facing: 1 },
    right: { id: 'right', name: 'RIGHTY', side: 'RIGHT', facing: -1 },
  };

  /* Every animatable channel with its neutral value. Units: px / degrees in
     viewBox space; 0–1 for the normalised ones. "Forward" is always toward
     the opponent, whichever way the character faces on screen. */
  const BASE = Object.freeze({
    x: 0, y: 0, rot: 0, sx: 1, sy: 1, // whole character (feet stay the anchor)
    lean: 6, bodySY: 1,               // upper body lean (deg, + = forward) and squash
    legL: 0, legR: 0,                 // foot lift (px)
    armL: 44, armR: 16,               // arm raise (deg, + = fist up)
    reachL: 1, reachR: 1,             // arm stretch along its length
    headRot: 0, headX: 0, headY: 0,   // head bob around the neck
    turn: 0,                          // 0 = face the opponent, 1 = face the camera
    blink: 0,                         // 0 open → 1 shut
    lookX: 0.7, lookY: 0.1,           // pupils, -1…1 (+x = toward the opponent)
    browL: 0, browR: 0,               // brow drop (px, negative = raised)
    browTiltL: 0, browTiltR: 0,       // extra brow rotation (deg)
    mouth: 0.55,                      // 0 gritted → 1 wide open
    rage: 0.15, throb: 0,             // face flush + vein size, vein pulse
    hatY: 0, hatRot: 0, flop: 0,      // hat pop and beanie-slouch / cap-brim flop
    steam: 0,                         // ear-steam puff progress 0…1
    spit: 0,                          // spit-spray progress 0…1
  });

  /* Named poses (partial states merged over BASE). Shown in design-system.html
     and used as keyframes by the animation code. */
  const POSES = {
    idle: {},
    yell: { mouth: 1, lean: 10, headRot: 5, headY: -3, armL: 58, armR: 36, browL: 3, browR: 4, spit: 0.45, rage: 0.3 },
    grit: { mouth: 0, lean: 7, headRot: -2, armL: -36, armR: -34, browL: 5, browR: 6, browTiltL: 5, browTiltR: -5 },
    flail: { mouth: 0.8, lean: 3, headRot: -5, armL: 56, armR: 46, sy: 1.03, lookY: -0.3 },
    windup: { armR: -62, armL: 30, lean: -7, x: -8, sy: 0.97, headRot: -7, mouth: 0.25, browR: 5, lookX: 1 },
    punch: { armR: 4, reachR: 1.45, lean: 15, x: 14, headRot: 6, mouth: 0.95, browL: 4, browR: 5, armL: 40 },
    flinch: { lean: -7, x: -10, headRot: -10, blink: 0.85, mouth: 0.12, armL: 38, armR: 46, browL: 6, browR: 6 },
    blink: { blink: 1, mouth: 0.25 },
    rage: { rage: 1, throb: 1, mouth: 0.9, browL: 6, browR: 7, lean: 9 },
    steam: { rage: 0.55, steam: 0.55, mouth: 0.75, headY: -6, hatY: -20, hatRot: -7, flop: 1, browL: -6, browR: -4 },
    camera: { turn: 1, mouth: 0, lookX: 0, lookY: 0, browL: -7, browR: -5, browTiltL: -10, browTiltR: 10, lean: 1, armL: -40, armR: -40, rage: 0 },
    lookUp: { lookX: 0.1, lookY: -1, headRot: -7, mouth: 0.45 },
    lookDown: { lookX: 0.6, lookY: 1, headRot: 5, mouth: 0.35 },
  };

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const r2 = (v) => Math.round(v * 100) / 100;
  const easeOut = (t) => 1 - (1 - t) * (1 - t);

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
   * @param {{state?: object, pose?: string}} [opts]
   */
  function create(teamId, opts = {}) {
    const team = TEAMS[teamId];
    if (!team) throw new Error(`Unknown team "${teamId}"`);
    injectCSS();

    const tpl = document.createElement('template');
    tpl.innerHTML = RIG_MARKUP.trim();
    const svg = tpl.content.firstElementChild;
    svg.setAttribute('data-team', team.id);

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
    const flops = [...svg.querySelectorAll('.hat-flop')].map((el) => ({ el, p: pivotOf(el), cap: el.closest('.hat-cap') !== null }));
    const steamL = [...svg.querySelectorAll('.steam-l')];
    const steamR = [...svg.querySelectorAll('.steam-r')];
    const spits = [...svg.querySelectorAll('.spit')];

    const piv = {
      upper: pivotOf(P.upper), armL: pivotOf(P.armL), armR: pivotOf(P.armR), head: pivotOf(P.head),
      eyes: pivotOf(P.eyes), browL: pivotOf(P.browL), browR: pivotOf(P.browR), mouth: pivotOf(P.mouth),
      hat: pivotOf(P.hat),
    };
    const MOUTH_DEPTH = 104; // full-open cavity depth below the pivot (viewBox px)

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
      setT(P.root, `${mirror}translate(${r2(s.x)} ${r2(s.y)}) ${around(204, 486, s.rot, s.sx, s.sy)}`);
      setT(P.legL, `translate(0 ${r2(-s.legL)})`);
      setT(P.legR, `translate(0 ${r2(-s.legR)})`);
      setT(P.upper, around(piv.upper[0], piv.upper[1], s.lean, 1, s.bodySY));
      setT(P.armL, around(piv.armL[0], piv.armL[1], s.armL, s.reachL, 1));
      setT(P.armR, around(piv.armR[0], piv.armR[1], -s.armR, s.reachR, 1));
      setT(P.head, `translate(${r2(s.headX)} ${r2(s.headY)}) ${around(piv.head[0], piv.head[1], s.headRot, 1, 1)}`);
      setT(P.face, `translate(${r2(-24 * s.turn)} ${r2(2 * s.turn)})`);

      // blink squashes whites + pupils together toward the eye line
      setT(P.eyes, around(piv.eyes[0], piv.eyes[1], 0, 1, 1 - 0.9 * clamp(s.blink, 0, 1)));
      setT(P.pupils, `translate(${r2(clamp(s.lookX, -1, 1) * 5)} ${r2(clamp(s.lookY, -1, 1) * 4)})`);
      setT(P.browL, `translate(0 ${r2(s.browL)}) ${around(piv.browL[0], piv.browL[1], s.browTiltL, 1, 1)}`);
      setT(P.browR, `translate(0 ${r2(s.browR)}) ${around(piv.browR[0], piv.browR[1], s.browTiltR, 1, 1)}`);

      // mouth: the cavity scales from its top edge, the jaw rides its bottom edge
      const m = clamp(s.mouth, 0, 1);
      const sy = lerp(0.3, 1, m);
      setT(P.mouth, around(piv.mouth[0], piv.mouth[1], 0, lerp(0.9, 1.05, m), 1));
      const cav = around(0, piv.mouth[1], 0, 1, sy);
      setT(P.cavity, cav);
      setT(P.mouthLine, cav);
      setT(P.jaw, `translate(0 ${r2(-(1 - sy) * MOUTH_DEPTH)})`);

      // rage: flush the face, grow the veins
      const rage = clamp(s.rage, 0, 1);
      flushes.forEach((el) => setO(el, rage * 0.85));
      const vk = lerp(0.55, 1.3, rage) * (1 + 0.1 * s.throb);
      veins.forEach(({ el, p }) => setT(el, around(p[0], p[1], 0, vk, vk)));

      setT(P.hat, `translate(0 ${r2(s.hatY)}) ${around(piv.hat[0], piv.hat[1], s.hatRot, 1, 1)}`);
      flops.forEach(({ el, p, cap }) => setT(el, around(p[0], p[1], cap ? -5 * s.flop : 4 * s.flop, 1, 1)));

      // ear steam: three puffs per ear, staggered
      const st = clamp(s.steam, 0, 1);
      [[steamL, 70, 196, -1], [steamR, 338, 188, 1]].forEach(([puffs, ex, ey, dir]) => {
        puffs.forEach((el, i) => {
          const t = clamp((st - i * 0.12) / 0.64, 0, 1);
          const k = lerp(0.4, 1.55, easeOut(t));
          setT(el, `translate(${r2(ex + dir * (30 + 20 * i) * t)} ${r2(ey - (26 + 28 * i) * t)}) scale(${r2(k)})`);
          setO(el, t <= 0 ? 0 : t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3);
        });
      });

      // spit spray from the front corner of the mouth
      const sp = clamp(s.spit, 0, 1);
      spits.forEach((el, i) => {
        const t = clamp((sp - i * 0.08) / 0.76, 0, 1);
        setT(el, `translate(${r2(312 + (26 + 16 * i) * t)} ${r2(232 + (-18 + 12 * i) * t + 20 * t * t)})`);
        setO(el, t <= 0 || t >= 1 ? 0 : 1 - t * t);
      });
    }

    // Outline width tracks the rendered size: 5 viewBox px, clamped for tiny renders.
    let ro = null;
    if (!opts.static && 'ResizeObserver' in root) {
      ro = new ResizeObserver((entries) => {
        const w = entries[0].contentRect.width;
        if (w > 0) svg.style.setProperty('--ow', `${r2(clamp((5 * w) / 400, 1.6, 6))}px`);
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
      /** Standalone SVG string of the current pose (for downloads / PFP canvas). */
      toSVG({ width = 400, height = 500, outline = 5 * (width / 400) } = {}) {
        apply();
        const cs = getComputedStyle(document.documentElement);
        const vars = TOKENS.map((t) => `--${t}:${cs.getPropertyValue('--' + t).trim()}`).join(';');
        const clone = svg.cloneNode(true);
        clone.removeAttribute('style');
        clone.setAttribute('width', width);
        clone.setAttribute('height', height);
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
