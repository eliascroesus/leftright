/* ==========================================================================
   LEFT RIGHT — cartoon FX art
   Brawl cloud, impact stars, confetti and the split seam. Same cut-paper
   style as the characters: flat fills, ink outlines, no gradients.
   Builders return fresh SVG elements; animation lives in fight.js.
   ========================================================================== */
(function (root) {
  'use strict';

  const LR = (root.LR = root.LR || {});

  /* FX ART:START */
  const FX_ART = {
  "cloud": "<svg class=\"fx fx-cloud\" viewBox=\"0 0 320 250\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\" focusable=\"false\"><g class=\"cloud-limbs\"><g class=\"cloud-limb cloud-limb--red\" transform=\"translate(112 98) rotate(-150)\"><path class=\"f-red line\" d=\"M-5.9 -14.7C-1.7 -18.4 19.3 -16.7 29.9 -16.4C40.6 -16.1 52.9 -15.5 58 -12.7C63.1 -10 60.7 -4.4 60.7 0.1C60.7 4.6 63.1 11.5 57.9 14C52.8 16.6 40.2 15.4 29.5 15.6C18.9 15.7 -1.8 18.5 -6 15C-10.1 11.4 -10.1 -11.1 -5.9 -14.7Z\"/><path class=\"f-red-dark line\" d=\"M51.7 -14.8C53.4 -16.2 63.6 -15.5 65.2 -14C66.8 -12.5 68 -4.5 68 0.3C67.9 5.1 66.5 13.3 64.9 14.8C63.3 16.3 53.4 16.5 51.8 15.1C50.2 13.6 48.8 5.2 48.8 0.2C48.8 -4.8 50.1 -13.4 51.7 -14.8Z\"/><path class=\"f-skin line\" d=\"M69.7 -10.3C72.4 -15 78.7 -19.9 83.8 -21C88.8 -22.1 96.2 -19.9 100.1 -16.9C104 -13.8 106.2 -7.6 107.2 -2.8C108.1 2 108.1 7.9 105.7 11.9C103.4 16 97.9 20.5 93 21.8C88 23 80.2 22 76 19.6C71.8 17.3 68.9 12.6 67.9 7.6C66.9 2.6 67.1 -5.5 69.7 -10.3Z\"/><path class=\"line-thin\" d=\"M90 -8C91.8 -7.8 99.2 -7.2 101 -7\"/><path class=\"line-thin\" d=\"M90 0C92.2 0.2 100.8 0.8 103 1\"/><path class=\"line-thin\" d=\"M90 8C91.7 8.2 98.3 8.8 100 9\"/></g><g class=\"cloud-limb cloud-limb--blue\" transform=\"translate(208 98) rotate(-30)\"><path class=\"f-blue line\" d=\"M-5.8 -15.5C-1.7 -19.1 19.6 -16.5 30.1 -16.2C40.7 -15.8 52.4 -16.1 57.5 -13.5C62.6 -10.9 60.4 -5.1 60.6 -0.4C60.7 4.2 63.6 11.6 58.4 14.3C53.3 17 40.7 15.6 30 15.7C19.3 15.8 -1.5 18.4 -5.7 14.8C-9.9 11.2 -10 -11.9 -5.8 -15.5Z\"/><path class=\"f-blue-dark line\" d=\"M52.2 -15C53.9 -16.4 63.6 -15.6 65.2 -14.1C66.8 -12.6 68.1 -5 68 -0.1C68 4.8 66.6 13.7 65 15.3C63.4 16.8 53.6 16.7 52 15.1C50.4 13.6 48.7 4.9 48.7 -0.2C48.7 -5.2 50.6 -13.6 52.2 -15Z\"/><path class=\"f-skin line\" d=\"M70.3 -9.9C72.9 -14.9 79 -20.1 83.9 -21.3C88.8 -22.6 95.8 -20.4 99.7 -17.3C103.6 -14.1 106.2 -7.6 107.2 -2.7C108.2 2.2 108.1 8.1 105.7 12.2C103.3 16.4 97.7 21.1 92.8 22.4C87.9 23.6 80.4 22 76.2 19.6C72.1 17.3 69 13.3 68 8.4C67 3.5 67.6 -5 70.3 -9.9Z\"/><path class=\"line-thin\" d=\"M90 -8C91.8 -7.8 99.2 -7.2 101 -7\"/><path class=\"line-thin\" d=\"M90 0C92.2 0.2 100.8 0.8 103 1\"/><path class=\"line-thin\" d=\"M90 8C91.7 8.2 98.3 8.8 100 9\"/></g><g class=\"cloud-limb\" transform=\"translate(92 206) rotate(-16)\"><path class=\"f-paper line\" d=\"M-30.2 -8.1C-24.2 -11.1 -10.2 -12.2 -2.2 -11.8C5.7 -11.5 12.2 -8.9 17.6 -6C23 -3 28.8 2.6 30.2 5.8C31.6 9.1 31.8 16.7 27.9 18.2C24 19.7 1.7 20.8 -8.4 20.9C-18.4 21 -29.3 20.2 -32.3 18.7C-35.3 17.2 -38.6 10.6 -38.2 6.1C-37.9 1.6 -36.2 -5.1 -30.2 -8.1Z\"/><path class=\"line-thin\" d=\"M-36 11C-30.7 11.5 -14.8 14.2 -4 14C6.8 13.8 23.5 10.7 29 10\"/></g><g class=\"cloud-limb\" transform=\"translate(230 206) rotate(16)\"><path class=\"f-paper line\" d=\"M30.3 -8.2C24.3 -11.2 10.1 -12.4 2.1 -12C-5.9 -11.7 -12.3 -9 -17.7 -6C-23.1 -3 -28.8 2.9 -30.1 6.1C-31.5 9.4 -31.7 16.9 -27.9 18.4C-24.1 19.9 -1.9 20.8 8.1 20.8C18 20.9 28.8 20.2 31.8 18.7C34.8 17.2 38.4 10.5 38.1 6.1C37.9 1.6 36.3 -5.1 30.3 -8.2Z\"/><path class=\"line-thin\" d=\"M36 11C30.7 11.5 14.8 14.2 4 14C-6.8 13.8 -23.5 10.7 -29 10\"/></g></g><g class=\"cloud-outline\"><path class=\"puff\" d=\"M166 183.2C153.1 184.6 138.3 178.5 127.4 171.5C116.5 164.4 104.6 152.7 100.5 140.8C96.3 128.9 97.3 111.4 102.4 100C107.5 88.5 119.2 77.3 131.1 72C143 66.7 160.4 65.2 173.8 68.3C187.1 71.3 202.7 80.5 210.9 90.2C219.1 99.9 223.9 114.1 222.9 126.2C221.9 138.4 214.4 153.5 204.9 163C195.4 172.5 179 181.8 166 183.2Z\"/><path class=\"puff\" d=\"M132.6 82.2C140 89 145.7 101 146.5 110.2C147.4 119.3 143.3 129.5 137.7 137.1C132 144.8 122.3 153.2 112.7 155.9C103.2 158.7 89 157.4 80.1 153.7C71.2 150 63.6 142.4 59.3 133.9C54.9 125.5 51.8 112 54 102.8C56.2 93.6 64.4 84.2 72.4 78.7C80.3 73.2 91.9 69 101.9 69.6C112 70.1 125.2 75.4 132.6 82.2Z\"/><path class=\"puff\" d=\"M200.2 72.5C209.5 68.1 222.4 65.6 232.5 67.6C242.6 69.5 254.7 76.2 260.9 84C267.1 91.8 270.2 104.6 269.8 114.1C269.4 123.6 265.3 133.9 258.5 141C251.7 148.1 239.4 155.2 229.2 156.7C219 158.2 205.8 154.7 197.1 149.9C188.4 145 180.3 136.8 177 127.5C173.6 118.2 173.1 103.1 176.9 94C180.8 84.8 191 76.9 200.2 72.5Z\"/><path class=\"puff\" d=\"M149.8 110.9C142.6 114.8 131.1 117 122.3 115.8C113.6 114.6 103 109.2 97.4 103.5C91.7 97.9 88.4 89.8 88.3 81.9C88.3 74.1 91.7 62.9 97.2 56.4C102.7 50 113.4 44.8 121.6 43.3C129.8 41.7 139.1 43.2 146.5 47C154 50.8 163.3 58.6 166.4 66.1C169.6 73.6 168.3 84.7 165.5 92.1C162.7 99.6 157 106.9 149.8 110.9Z\"/><path class=\"puff\" d=\"M236 80.2C234.9 88.3 229.3 97.6 222.7 103.3C216.1 109 205.1 113.6 196.4 114.2C187.7 114.9 177.8 111.9 170.7 107.2C163.5 102.4 156 93.9 153.6 85.8C151.2 77.6 152.3 66.2 156.2 58.3C160.2 50.5 169 42.1 177.2 38.7C185.5 35.3 197.2 35.2 205.8 37.9C214.5 40.6 224.1 47.9 229.1 55C234.2 62 237.1 72.2 236 80.2Z\"/><path class=\"puff\" d=\"M76.9 121.5C83.8 120 93.1 120.3 99.2 123.3C105.4 126.3 111.1 133.1 114 139.3C116.9 145.5 118.2 153.9 116.5 160.5C114.8 167.1 109.8 175 103.5 178.9C97.2 182.7 86.3 184.3 78.6 183.4C71 182.6 62.6 178.3 57.8 173.5C53 168.7 50 161.7 50 154.8C50 147.9 53.4 137.7 57.9 132.2C62.4 126.6 70 123 76.9 121.5Z\"/><path class=\"puff\" d=\"M255.7 125.1C262.2 128.9 268.1 137.5 270.7 144.1C273.3 150.7 273.9 158.5 271.4 164.9C269 171.3 262.7 178.7 256.2 182.5C249.7 186.2 239.9 188.6 232.4 187.2C225 185.9 216.2 179.9 211.3 174.3C206.4 168.7 203.1 160.6 203 153.8C202.9 146.9 206 138.6 210.8 133.2C215.5 127.8 223.9 122.8 231.4 121.4C238.9 120.1 249.1 121.4 255.7 125.1Z\"/><path class=\"puff\" d=\"M190.4 196.8C184.7 202.7 175 207.1 166.4 208.2C157.9 209.2 146.5 207.3 139.1 203.1C131.8 198.8 125.1 190.2 122.5 182.5C119.8 174.9 120.5 164.5 123.4 157.3C126.3 150 132.5 142.8 139.8 139C147.1 135.1 158.8 132.9 167.4 134.3C175.9 135.8 185.5 141.2 191 147.6C196.5 154 200.6 164.6 200.5 172.9C200.4 181.1 196 191 190.4 196.8Z\"/><path class=\"puff\" d=\"M130.6 139.2C136.7 142.2 144.7 148.1 147.8 153.9C150.9 159.7 151.3 167.9 149.2 174C147 180 140.5 186.7 134.7 190.4C128.9 194.1 121 196.6 114.3 196.2C107.5 195.8 99.1 192.3 94.2 187.8C89.3 183.2 85.4 175.1 84.9 168.7C84.4 162.3 86.8 154.6 91.2 149.2C95.6 143.8 104.6 137.9 111.2 136.3C117.7 134.6 124.5 136.3 130.6 139.2Z\"/><path class=\"puff\" d=\"M173.9 165.4C174.5 159.6 178.6 154.7 183.6 150.6C188.5 146.6 196.9 141.8 203.5 141.1C210 140.5 217.8 142.8 222.7 146.7C227.7 150.6 231.9 158.3 233.1 164.4C234.3 170.6 232.7 178.3 229.9 183.4C227.1 188.5 222.1 192.6 216.1 194.9C210.2 197.3 200.2 199.1 194.1 197.5C188.1 195.8 183.3 190.4 179.9 185C176.5 179.7 173.3 171.1 173.9 165.4Z\"/><path class=\"puff\" d=\"M144.5 90.5C139.2 87.8 135.2 82.7 132.8 77C130.5 71.2 128.7 61.9 130.5 56C132.3 50 137.9 44.2 143.7 41.4C149.4 38.7 158.4 38.2 164.9 39.3C171.5 40.5 178.8 43.8 183 48.4C187.2 52.9 190.4 60.9 190.4 66.8C190.4 72.8 187.4 79.5 183.1 83.9C178.8 88.3 171.2 92.1 164.8 93.2C158.4 94.3 149.9 93.2 144.5 90.5Z\"/></g><g class=\"cloud-fill\"><path class=\"puff f-dust\" d=\"M166 183.2C153.1 184.6 138.3 178.5 127.4 171.5C116.5 164.4 104.6 152.7 100.5 140.8C96.3 128.9 97.3 111.4 102.4 100C107.5 88.5 119.2 77.3 131.1 72C143 66.7 160.4 65.2 173.8 68.3C187.1 71.3 202.7 80.5 210.9 90.2C219.1 99.9 223.9 114.1 222.9 126.2C221.9 138.4 214.4 153.5 204.9 163C195.4 172.5 179 181.8 166 183.2Z\"/><path class=\"puff f-dust\" d=\"M132.6 82.2C140 89 145.7 101 146.5 110.2C147.4 119.3 143.3 129.5 137.7 137.1C132 144.8 122.3 153.2 112.7 155.9C103.2 158.7 89 157.4 80.1 153.7C71.2 150 63.6 142.4 59.3 133.9C54.9 125.5 51.8 112 54 102.8C56.2 93.6 64.4 84.2 72.4 78.7C80.3 73.2 91.9 69 101.9 69.6C112 70.1 125.2 75.4 132.6 82.2Z\"/><path class=\"puff f-dust\" d=\"M200.2 72.5C209.5 68.1 222.4 65.6 232.5 67.6C242.6 69.5 254.7 76.2 260.9 84C267.1 91.8 270.2 104.6 269.8 114.1C269.4 123.6 265.3 133.9 258.5 141C251.7 148.1 239.4 155.2 229.2 156.7C219 158.2 205.8 154.7 197.1 149.9C188.4 145 180.3 136.8 177 127.5C173.6 118.2 173.1 103.1 176.9 94C180.8 84.8 191 76.9 200.2 72.5Z\"/><path class=\"puff f-dust\" d=\"M149.8 110.9C142.6 114.8 131.1 117 122.3 115.8C113.6 114.6 103 109.2 97.4 103.5C91.7 97.9 88.4 89.8 88.3 81.9C88.3 74.1 91.7 62.9 97.2 56.4C102.7 50 113.4 44.8 121.6 43.3C129.8 41.7 139.1 43.2 146.5 47C154 50.8 163.3 58.6 166.4 66.1C169.6 73.6 168.3 84.7 165.5 92.1C162.7 99.6 157 106.9 149.8 110.9Z\"/><path class=\"puff f-dust\" d=\"M236 80.2C234.9 88.3 229.3 97.6 222.7 103.3C216.1 109 205.1 113.6 196.4 114.2C187.7 114.9 177.8 111.9 170.7 107.2C163.5 102.4 156 93.9 153.6 85.8C151.2 77.6 152.3 66.2 156.2 58.3C160.2 50.5 169 42.1 177.2 38.7C185.5 35.3 197.2 35.2 205.8 37.9C214.5 40.6 224.1 47.9 229.1 55C234.2 62 237.1 72.2 236 80.2Z\"/><path class=\"puff f-dust\" d=\"M76.9 121.5C83.8 120 93.1 120.3 99.2 123.3C105.4 126.3 111.1 133.1 114 139.3C116.9 145.5 118.2 153.9 116.5 160.5C114.8 167.1 109.8 175 103.5 178.9C97.2 182.7 86.3 184.3 78.6 183.4C71 182.6 62.6 178.3 57.8 173.5C53 168.7 50 161.7 50 154.8C50 147.9 53.4 137.7 57.9 132.2C62.4 126.6 70 123 76.9 121.5Z\"/><path class=\"puff f-dust\" d=\"M255.7 125.1C262.2 128.9 268.1 137.5 270.7 144.1C273.3 150.7 273.9 158.5 271.4 164.9C269 171.3 262.7 178.7 256.2 182.5C249.7 186.2 239.9 188.6 232.4 187.2C225 185.9 216.2 179.9 211.3 174.3C206.4 168.7 203.1 160.6 203 153.8C202.9 146.9 206 138.6 210.8 133.2C215.5 127.8 223.9 122.8 231.4 121.4C238.9 120.1 249.1 121.4 255.7 125.1Z\"/><path class=\"puff f-dust\" d=\"M190.4 196.8C184.7 202.7 175 207.1 166.4 208.2C157.9 209.2 146.5 207.3 139.1 203.1C131.8 198.8 125.1 190.2 122.5 182.5C119.8 174.9 120.5 164.5 123.4 157.3C126.3 150 132.5 142.8 139.8 139C147.1 135.1 158.8 132.9 167.4 134.3C175.9 135.8 185.5 141.2 191 147.6C196.5 154 200.6 164.6 200.5 172.9C200.4 181.1 196 191 190.4 196.8Z\"/><path class=\"puff f-dust\" d=\"M130.6 139.2C136.7 142.2 144.7 148.1 147.8 153.9C150.9 159.7 151.3 167.9 149.2 174C147 180 140.5 186.7 134.7 190.4C128.9 194.1 121 196.6 114.3 196.2C107.5 195.8 99.1 192.3 94.2 187.8C89.3 183.2 85.4 175.1 84.9 168.7C84.4 162.3 86.8 154.6 91.2 149.2C95.6 143.8 104.6 137.9 111.2 136.3C117.7 134.6 124.5 136.3 130.6 139.2Z\"/><path class=\"puff f-dust\" d=\"M173.9 165.4C174.5 159.6 178.6 154.7 183.6 150.6C188.5 146.6 196.9 141.8 203.5 141.1C210 140.5 217.8 142.8 222.7 146.7C227.7 150.6 231.9 158.3 233.1 164.4C234.3 170.6 232.7 178.3 229.9 183.4C227.1 188.5 222.1 192.6 216.1 194.9C210.2 197.3 200.2 199.1 194.1 197.5C188.1 195.8 183.3 190.4 179.9 185C176.5 179.7 173.3 171.1 173.9 165.4Z\"/><path class=\"puff f-dust\" d=\"M144.5 90.5C139.2 87.8 135.2 82.7 132.8 77C130.5 71.2 128.7 61.9 130.5 56C132.3 50 137.9 44.2 143.7 41.4C149.4 38.7 158.4 38.2 164.9 39.3C171.5 40.5 178.8 43.8 183 48.4C187.2 52.9 190.4 60.9 190.4 66.8C190.4 72.8 187.4 79.5 183.1 83.9C178.8 88.3 171.2 92.1 164.8 93.2C158.4 94.3 149.9 93.2 144.5 90.5Z\"/></g><g class=\"cloud-swirls\"><path class=\"swirl\" d=\"M96 108C98.7 105.7 105.7 95.7 112 94C118.3 92.3 129.3 94.3 134 98C138.7 101.7 139 113 140 116\"/><path class=\"swirl\" d=\"M186 90C189.3 89 200 83 206 84C212 85 219.3 94 222 96\"/><path class=\"swirl\" d=\"M140 156C143.3 157.3 152.7 164 160 164C167.3 164 180 157.3 184 156\"/><path class=\"swirl\" d=\"M214 132C217 133.3 228.3 135.7 232 140C235.7 144.3 235.3 155 236 158\"/><path class=\"swirl\" d=\"M84 140C85.3 143 88 154 92 158C96 162 105.3 163 108 164\"/></g><g class=\"cloud-marks\"><text class=\"grawlix\" x=\"160\" y=\"136\" text-anchor=\"middle\">#@%&amp;!</text><text class=\"bang\" x=\"112\" y=\"30\" text-anchor=\"middle\" transform=\"rotate(-12 112 30)\">!</text><text class=\"bang\" x=\"208\" y=\"30\" text-anchor=\"middle\" transform=\"rotate(12 208 30)\">!</text></g><g class=\"cloud-stars\"><g class=\"cloud-star\"><path class=\"f-star line\" d=\"M162.4 2.3C162.7 2.4 163.5 9.9 164.8 11.2C166.2 12.5 173.6 13.4 173.6 13.7C173.7 14 166.4 17.3 165.5 19C164.7 20.8 166.7 28.5 166.5 28.6C166.3 28.7 160.9 22.3 159 22C157.1 21.6 150.3 25.7 150.1 25.6C149.9 25.4 154.3 19.4 154 17.4C153.8 15.5 147.9 9.3 148 9.1C148.2 8.8 155.9 10.8 157.6 10C159.3 9.3 162.2 2.3 162.4 2.3Z\"/></g><g class=\"cloud-star\"><path class=\"f-star line\" d=\"M29.4 99.2C29.7 99.2 31 106.4 32.4 107.5C33.7 108.7 41.1 108.6 41.1 108.9C41.2 109.2 34.5 113.2 33.7 114.8C33 116.4 34.6 122.8 34.4 122.9C34.2 123 29.1 117.9 27.4 117.8C25.7 117.6 20.1 121.6 19.9 121.4C19.7 121.3 22.2 115.2 21.7 113.5C21.3 111.8 15.7 107.2 15.8 106.9C16 106.6 23.1 107.3 24.7 106.4C26.2 105.5 29.1 99.1 29.4 99.2Z\"/></g><g class=\"cloud-star\"><path class=\"f-star line\" d=\"M289.6 99C289.8 99 292.5 105.5 294.2 106.3C295.8 107 303.5 105.3 303.7 105.5C303.8 105.8 298.4 111.1 298.2 112.8C297.9 114.5 301.5 120.1 301.3 120.3C301.1 120.5 294.7 117.7 293 118.2C291.3 118.7 286.8 124.4 286.5 124.3C286.3 124.2 287.2 116.2 286.3 114.6C285.5 112.9 278.8 110.7 278.9 110.5C279 110.2 286.7 109 287.9 107.7C289.2 106.3 289.4 99.1 289.6 99Z\"/></g><g class=\"cloud-star\"><path class=\"f-star line\" d=\"M41.8 177.3C42 177.3 42.4 183.2 43.5 184.2C44.6 185.3 51.2 186.1 51.3 186.3C51.3 186.5 45.6 188.8 44.8 190.2C44 191.6 44.7 198.1 44.5 198.2C44.2 198.2 40.1 193 38.6 192.7C37.1 192.4 31.9 195.8 31.8 195.6C31.6 195.5 34.6 190.2 34.5 188.7C34.4 187.2 30.5 183 30.7 182.8C30.8 182.5 37.1 183.7 38.4 183.1C39.7 182.4 41.6 177.2 41.8 177.3Z\"/></g><g class=\"cloud-star\"><path class=\"f-star line\" d=\"M281 177.2C281.2 177.2 282.5 183.1 283.6 184.1C284.7 185.1 290.4 185.2 290.4 185.4C290.5 185.6 285.2 188.4 284.7 189.9C284.1 191.3 285.9 197.5 285.6 197.6C285.4 197.7 280.5 193.3 278.9 193.1C277.4 192.9 272.5 196.1 272.4 195.9C272.2 195.8 275.6 190.7 275.2 189.2C274.9 187.7 269.5 183.3 269.6 183.1C269.7 182.9 276.1 184.7 277.4 184C278.7 183.3 280.8 177.2 281 177.2Z\"/></g><g class=\"cloud-star\"><path class=\"f-star line\" d=\"M159.8 222.4C160 222.4 162 227.2 163.1 227.9C164.2 228.7 169.2 228.6 169.2 228.8C169.3 229 164.6 231.6 164.2 232.9C163.8 234.3 166.2 240.2 166 240.4C165.9 240.5 161.1 236.1 159.8 236.1C158.5 236.2 154.7 240.5 154.6 240.4C154.4 240.3 155.7 234.4 155.3 233.1C154.9 231.8 150.8 229.7 150.9 229.5C151 229.3 156.4 228.9 157.4 228.1C158.5 227.2 159.6 222.4 159.8 222.4Z\"/></g></g></svg>",
  "star": "<svg class=\"fx fx-star\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\" focusable=\"false\"><path class=\"f-star line\" d=\"M30 4.8C30.5 4.8 34.2 19.6 37 21.7C39.8 23.8 54.1 22.3 54.3 22.8C54.4 23.3 42.2 31.4 41.1 34.7C40 38.1 45.6 51.3 45.2 51.6C44.7 51.9 33.5 42.8 30 42.9C26.4 42.9 15 52.2 14.5 51.9C14.1 51.6 19.8 38.2 18.7 34.8C17.5 31.5 4.6 23.9 4.8 23.4C5 22.9 20.4 23.8 23.3 21.6C26.3 19.5 29.5 4.8 30 4.8Z\"/></svg>",
  "spark": "<svg class=\"fx fx-spark\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\" focusable=\"false\"><path class=\"f-star line\" d=\"M49 11.2C49.3 11.5 39.5 25.2 39.5 29.6C39.5 34 49 48.6 48.7 49C48.4 49.3 34.6 38.9 30.1 38.9C25.6 38.9 10.8 49.3 10.4 49C10.1 48.7 21 34.3 21 29.9C21.1 25.5 10.2 11.7 10.5 11.3C10.9 11 25.6 20.6 30.1 20.6C34.5 20.6 48.6 10.9 49 11.2Z\"/></svg>",
  "confetti": [
    "<svg class=\"fx fx-confetti\" viewBox=\"-4 -6 34 26\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\" focusable=\"false\"><path class=\"confetti f-c line-soft\" d=\"M-0.4 0.3C0.7 -0.4 20.4 -2.5 21.5 -2.1C22.7 -1.6 23.8 8.8 22.8 9.6C21.8 10.3 2.1 12.8 0.9 12.3C-0.2 11.9 -1.4 1 -0.4 0.3Z\"/></svg>",
    "<svg class=\"fx fx-confetti\" viewBox=\"-4 -6 34 26\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\" focusable=\"false\"><path class=\"confetti f-c line-soft\" d=\"M-0.1 4C0.7 2 3.5 -0.9 5.2 -0.9C6.8 -0.9 8.1 4.1 9.8 4.1C11.5 4.1 13.4 -0.8 15.1 -0.9C16.9 -0.9 18.6 3.9 20.2 3.9C21.8 3.8 24.1 -1.5 24.9 -1.2C25.7 -0.8 25.7 3.9 24.9 6C24.1 8 21.8 11.1 20.2 11.1C18.5 11.1 16.8 6 15.2 6C13.5 6 11.8 11 10.2 10.9C8.5 10.9 6.7 5.8 5.1 5.8C3.4 5.8 1 11.3 0.1 11C-0.8 10.7 -1 6 -0.1 4Z\"/></svg>",
    "<svg class=\"fx fx-confetti\" viewBox=\"-4 -6 34 26\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\" focusable=\"false\"><path class=\"confetti f-c line-soft\" d=\"M16.2 7.5C16.2 9.3 14.7 11.9 13.4 13.3C12.1 14.6 10.1 15.5 8.3 15.6C6.5 15.6 4 14.9 2.7 13.5C1.3 12.2 0 9.3 0 7.5C0 5.7 1.4 3.8 2.7 2.6C4 1.4 5.9 0.3 7.6 0.3C9.4 0.2 11.8 1.1 13.2 2.3C14.6 3.5 16.2 5.7 16.2 7.5Z\"/></svg>",
    "<svg class=\"fx fx-confetti\" viewBox=\"-4 -6 34 26\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\" focusable=\"false\"><path class=\"confetti f-c line-soft\" d=\"M0 16.1C-0.3 15.6 9.7 -1.1 10.4 -1.2C11.1 -1.2 20.3 15.3 19.9 15.8C19.6 16.4 0.4 16.7 0 16.1Z\"/></svg>",
    "<svg class=\"fx fx-confetti\" viewBox=\"-4 -6 34 26\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\" focusable=\"false\"><path class=\"confetti f-c line-soft\" d=\"M10.3 -0.6C10.6 -0.6 12.1 4.8 13.3 5.6C14.4 6.4 20 5.9 20 6.1C20.1 6.3 15.4 9.9 15 11.4C14.6 12.8 16.7 18.6 16.5 18.8C16.3 18.9 11.6 15.4 10 15.4C8.4 15.4 3.3 18.6 3.1 18.5C2.9 18.3 5.3 12.7 4.9 11.3C4.6 9.9 -0.1 6.6 0 6.4C0.1 6.2 6.2 6.8 7.4 6C8.6 5.2 10.1 -0.6 10.3 -0.6Z\"/></svg>"
  ]
};
  /* FX ART:END */

  const FX_CSS = `
.fx{overflow:visible;--ow:3px}
.fx .line{stroke:var(--ink);stroke-width:var(--ow);vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.fx .line-thin{fill:none;stroke:var(--ink);stroke-width:calc(var(--ow) * .6);vector-effect:non-scaling-stroke;stroke-linecap:round;stroke-linejoin:round}
.fx .line-soft{stroke:var(--ink);stroke-width:calc(var(--ow) * .7);vector-effect:non-scaling-stroke;stroke-linejoin:round}
.fx .f-star{fill:var(--star)}
.fx .f-dust{fill:var(--dust)}
.fx .f-paper{fill:var(--paper)}
.fx .f-skin{fill:var(--skin)}
.fx .f-red{fill:var(--red)}
.fx .f-red-dark{fill:var(--red-dark)}
.fx .f-blue{fill:var(--blue)}
.fx .f-blue-dark{fill:var(--blue-dark)}
.fx .f-c{fill:var(--c, var(--star))}
.fx-cloud .cloud-outline .puff{fill:var(--ink);stroke:var(--ink);stroke-width:calc(var(--ow) * 2);vector-effect:non-scaling-stroke;stroke-linejoin:round}
.fx-cloud .swirl{fill:none;stroke:var(--dust-2);stroke-width:calc(var(--ow) * 1.4);vector-effect:non-scaling-stroke;stroke-linecap:round}
.fx-cloud text{font-family:var(--font-display);fill:var(--ink)}
.fx-cloud .grawlix{font-size:30px;letter-spacing:1px}
.fx-cloud .bang{font-size:46px;fill:var(--star);stroke:var(--ink);stroke-width:calc(var(--ow) * 1.2);paint-order:stroke;stroke-linejoin:round}
`;

  let cssInjected = false;
  function injectCSS() {
    if (cssInjected || document.getElementById('fx-css')) return;
    const style = document.createElement('style');
    style.id = 'fx-css';
    style.textContent = FX_CSS;
    document.head.appendChild(style);
    cssInjected = true;
  }

  function toElement(markup) {
    injectCSS();
    const tpl = document.createElement('template');
    tpl.innerHTML = markup.trim();
    return tpl.content.firstElementChild;
  }

  /* Keep outlines a constant weight relative to the drawing, like the rig. */
  function autoOutline(svg, unitsPerOutline) {
    if (!('ResizeObserver' in root)) return svg;
    const vb = svg.viewBox.baseVal;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      if (w > 0 && vb && vb.width) {
        const px = Math.min(6, Math.max(1.5, (unitsPerOutline * w) / vb.width));
        svg.style.setProperty('--ow', `${Math.round(px * 100) / 100}px`);
      }
    });
    ro.observe(svg);
    return svg;
  }

  /* ---- Split background ------------------------------------------------
     Paints the blue side and the ink seam into `host` (the host paints the
     red side as its own background). The fill and the seam share one
     hand-cut path in pixel space, so they can never drift apart, and the
     wobble stays the same size on any screen. The seam runs from `from` to
     `to` (fractions of the host box); `corners` lists the box corners on
     the blue side, in path order. */
  const NS = 'http://www.w3.org/2000/svg';

  function catmull(pts) {
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d;
  }

  function split(host, opts) {
    const o = Object.assign({ from: [0.54, 0], to: [0.46, 1], corners: [[1, 1], [1, 0]], seed: 7 }, opts);
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'split-art');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.innerHTML = '<path class="split-art__blue"/><path class="split-art__seam"/>';
    host.prepend(svg);
    const fill = svg.firstChild;
    const seam = svg.lastChild;
    const rnd = (i) => {
      const x = Math.sin(i * 127.1 + o.seed * 311.7) * 43758.5453;
      return (x - Math.floor(x)) * 2 - 1;
    };
    let size = [0, 0];

    function draw(w, h) {
      if (!w || !h) return;
      size = [w, h];
      const pad = 48;
      const ax = o.from[0] * w, ay = o.from[1] * h, bx = o.to[0] * w, by = o.to[1] * h;
      const len = Math.hypot(bx - ax, by - ay) || 1;
      const ux = (bx - ax) / len, uy = (by - ay) / len; // along the seam
      const nx = -uy, ny = ux;                           // across the seam
      const amp = Math.max(2, Math.min(6, Math.min(w, h) * 0.012));
      const steps = Math.max(4, Math.round((len + pad * 2) / 38));
      const pts = [];
      for (let i = 0; i <= steps; i++) {
        const t = -pad + ((len + pad * 2) * i) / steps;
        const off = i === 0 || i === steps ? 0 : rnd(i) * amp + Math.sin(i * 0.55 + o.seed) * amp * 0.8;
        pts.push([ax + ux * t + nx * off, ay + uy * t + ny * off]);
      }
      const d = catmull(pts);
      const far = o.corners.map(([cx, cy]) => `L${cx ? w + pad : -pad} ${cy ? h + pad : -pad}`).join('');
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      seam.setAttribute('d', d);
      fill.setAttribute('d', `${d}${far}Z`);
    }

    let ro = null;
    if ('ResizeObserver' in root) {
      ro = new ResizeObserver((entries) => {
        const r = entries[0].contentRect;
        draw(Math.round(r.width), Math.round(r.height));
      });
      ro.observe(host);
    } else {
      draw(host.clientWidth, host.clientHeight);
    }

    return {
      svg,
      /** Change the geometry (e.g. mobile stack vs desktop) and redraw. */
      set(next) {
        Object.assign(o, next);
        draw(size[0] || host.clientWidth, size[1] || host.clientHeight);
      },
      destroy() {
        if (ro) ro.disconnect();
        svg.remove();
      },
    };
  }

  /* Team colour sets for confetti (CSS custom property names). */
  const CONFETTI_COLOURS = {
    left: ['--red', '--red-light', '--red-dark', '--paper'],
    right: ['--blue', '--blue-light', '--blue-dark', '--paper'],
    neutral: ['--star', '--paper', '--red', '--blue'],
  };

  LR.fx = {
    art: FX_ART,
    css: FX_CSS,
    injectCSS,
    autoOutline,
    CONFETTI_COLOURS,
    split,
    /** The brawl cloud: limbs, merged puffs, swirls, grawlix and stars. */
    cloud() { return autoOutline(toElement(FX_ART.cloud), 4); },
    star() { return autoOutline(toElement(FX_ART.star), 3); },
    spark() { return autoOutline(toElement(FX_ART.spark), 3); },
    /** One confetti piece; `colour` is a token name like "--red". */
    confetti(index, colour) {
      const el = toElement(FX_ART.confetti[index % FX_ART.confetti.length]);
      el.style.setProperty('--c', `var(${colour})`);
      el.style.setProperty('--ow', '2px');
      return el;
    },
  };
})(window);
