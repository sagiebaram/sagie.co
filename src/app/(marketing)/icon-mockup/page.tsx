'use client'

import { useEffect, useRef, useState, useCallback, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { getGSAP } from '@/lib/gsap'
import { GridBackground } from '@/components/ui/GridBackground'

/* ─────────────────────────────────────────────
   INLINE SVG COMPONENTS
   Each icon is inlined so we can animate individual
   paths/groups. Paths are grouped logically.
   ───────────────────────────────────────────── */

function CommunityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 623 673" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer ring of connected nodes — this is the "circle" */}
      <g data-part="ring">
        <path data-part="node-1" d="M600.845 307.991C598.92 296.413 597.025 285.285 595.101 273.983C599.394 272.091 603.756 270.17 608.874 267.916C622.607 325.212 621.365 381.487 601.475 437.11C626.069 459.871 626.649 489.107 613.937 510.773C601.12 532.618 574.618 545.126 545.467 536.151C531.894 548.846 519.262 561.971 505.296 573.478C464.013 607.491 416.891 629.214 363.981 637.959C361.138 638.429 359.481 639.394 358.19 642.169C348.367 663.283 325.55 674.98 301.576 671.436C279.084 668.111 260.227 649.202 257.054 626.791C252.853 597.11 273.202 569.827 302.635 565.678C332.245 561.503 359.041 581.903 363.237 611.882C363.694 615.146 363.736 618.468 364.022 622.48C430.172 609.933 485.228 578.417 530.013 528.393C504.932 508.816 499.147 475.497 515.086 450.512C528.933 428.808 557.559 415.822 588.155 429.052C601.706 389.722 605.853 349.595 600.845 307.991ZM551.591 520.71C553.034 521.089 554.465 521.533 555.924 521.838C575.1 525.852 595.329 514.961 602.469 496.796C610.091 477.407 602.591 456.33 584.263 445.632C567.277 435.718 544.888 439.808 532.293 454.906C512.066 479.153 525.98 512.896 551.591 520.71ZM342.39 600.796C333.604 586.387 318.994 579.289 303.146 582.614C288.455 585.697 278.438 594.76 274.392 609.279C270.424 623.517 274.644 636.027 285.355 645.903C298.391 657.922 318.778 658.729 332.233 648.257C344.219 638.929 352.912 620.016 342.39 600.796Z" fill="currentColor"/>
        <path data-part="node-2" d="M92.3286 243.803C75.2923 260.536 55.7372 264.149 32.8856 256.451C16.0681 307.522 15.115 359.123 27.9206 411.355C23.3356 413.64 18.8994 415.851 13.4539 418.566C10.9805 404.691 7.97725 391.212 6.27475 377.571C3.05112 351.741 2.76062 325.758 7.1685 300.065C9.88638 284.222 14.3274 268.663 18.3287 253.062C19.0815 250.127 19.1843 248.326 16.7946 246.169C-2.14931 229.074 -4.74196 200.515 7.37517 180.419C20.6664 158.376 46.0124 149.343 71.1068 157.547C71.4197 157.649 71.7558 157.681 71.0969 157.55C83.8345 144.633 95.6657 131.554 108.631 119.717C134.299 96.2809 163.697 78.5484 195.958 65.6024C198.591 64.5456 200.516 63.5061 201.742 60.3698C204.434 53.4822 212.963 50.8461 219.875 54.0376C227.034 57.3427 230.079 65.6695 226.815 73.0112C224.006 79.3288 215.578 82.7555 209.058 79.7105C206.221 78.3854 204.009 78.3492 201.248 79.541C158.91 97.8183 121.909 123.485 91.6324 158.492C89.6872 160.742 87.9085 163.135 85.894 165.659C98.8352 176.161 105.852 189.668 106.346 206.153C106.772 220.337 102.359 232.994 92.3286 243.803ZM48.0259 243.557C64.7715 245.484 79.1457 238.049 86.0479 223.891C93.3164 208.982 90.6133 193.291 78.7238 181.376C67.8755 170.505 50.6131 168.004 36.2664 175.225C22.6954 182.056 14.5926 197.595 16.8548 212.451C19.2892 228.439 29.9496 239.363 48.0259 243.557Z" fill="currentColor"/>
        <path data-part="node-3" d="M199.639 621.815C152.991 603.575 113.496 575.798 80.8871 538.312C78.2523 535.284 75.8691 536.242 73.0243 536.973C47.8826 543.429 23.0936 533.834 9.14045 512.273C-11.945 479.691 5.37794 435.32 42.9504 425.671C70.241 418.663 97.9663 431.111 110.15 455.842C122.417 480.744 115.395 509.567 92.1525 528.137C130.608 571.656 177.536 601.37 233.629 616.718C234.163 621.893 234.703 627.129 235.384 633.733C223.354 629.737 211.673 625.856 199.639 621.815ZM97.2754 467.959C96.5121 466.122 95.8604 464.229 94.9684 462.457C86.5266 445.684 66.8532 437.031 47.6394 441.597C29.8191 445.831 15.885 463.111 16.509 481.289C17.1053 498.66 25.0772 511.982 41.287 519.06C57.4263 526.107 72.8315 523.558 85.7819 511.755C98.5028 500.161 102.548 485.483 97.2754 467.959Z" fill="currentColor"/>
        <path data-part="node-4" d="M428.589 66.0468C476.981 86.6998 517.811 116.683 549.528 158.286C580.961 146.721 608.285 164.335 617.712 186.622C628.512 212.157 618.866 240.608 594.675 254.154C571.339 267.221 540.766 260.3 525.283 238.332C511.385 218.612 511.237 186.462 536.232 165.84C498.78 119.109 451.06 87.7993 393.741 70.1365C393.962 65.2352 394.191 60.1609 394.475 53.8847C405.96 57.9562 417.108 61.9077 428.589 66.0468ZM582.863 173.97C580.807 173.322 578.78 172.559 576.692 172.044C562.575 168.559 546.139 175.329 538.108 187.886C529.913 200.697 530.442 218.047 539.377 229.515C549.027 241.903 564.485 246.853 579.495 242.361C594.121 237.984 604.26 225.111 605.582 209.24C606.745 195.294 597.772 181.079 582.863 173.97Z" fill="currentColor"/>
      </g>
      {/* Center node */}
      <g data-part="center">
        <path d="M352.088 15.4555C387.411 48.4102 376.544 105.026 332.099 121.319C294.881 134.963 254.066 109.7 248.75 70.6803C245.472 46.614 258.91 19.1704 280.475 7.80535C304.249 -4.72401 330.819 -2.16551 352.088 15.4555ZM303.294 16.9825C277.881 21.829 261.461 44.3675 265.142 69.3477C268.955 95.2188 294.84 113.257 320.037 107.531C344.437 101.986 358.479 80.4652 356.672 59.4131C354.28 31.5449 332.021 14.1824 303.294 16.9825Z" fill="currentColor"/>
      </g>
      {/* Small connector details */}
      <g data-part="connectors" opacity="0.9">
        <path d="M378.059 572.788C383.761 565.95 389.163 565.054 396.742 569.135C397.797 569.703 399.507 569.818 400.626 569.391C424.406 560.3 446.081 547.518 466.133 531.888C468.881 529.747 470.268 527.603 470.259 523.724C470.241 516.042 476.695 510.83 484.202 511.476C491.584 512.112 496.812 518.503 496.073 525.987C495.355 533.258 488.799 538.35 481.436 537.836C479.299 537.686 476.553 538.248 474.958 539.551C453.929 556.725 430.794 570.223 405.557 580.196C404.157 580.748 402.592 582.134 402.089 583.495C399.32 590.986 392.476 594.67 385.045 592.349C378.337 590.254 374.921 583.38 376.907 575.918C377.159 574.968 377.555 574.057 378.059 572.788Z" fill="currentColor"/>
        <path d="M134.421 511.821C145.207 510.294 150.94 515.085 151.922 525.42C152.117 527.477 153.881 529.84 155.597 531.226C173.042 545.321 192.296 556.437 212.819 565.404C214.799 566.269 216.747 567.374 218.826 567.799C220.632 568.169 222.884 568.315 224.453 567.555C231.311 564.235 239.862 567.046 243.067 573.998C246.158 580.703 242.987 588.916 236.307 591.502C228.479 594.533 221.006 590.872 218.361 583.042C217.799 581.381 216.211 579.477 214.63 578.839C190.093 568.933 167.247 556.211 146.901 539.151C145.632 538.087 143.43 537.535 141.74 537.677C134.164 538.311 128.518 535.022 126.59 528.449C124.566 521.554 127.372 515.346 134.421 511.821Z" fill="currentColor"/>
        <path d="M153.742 161.275C150.235 164.07 148.572 166.729 149.158 171.505C150.165 179.72 142.138 186.872 133.541 186.552C125.041 186.236 118.465 179.267 119.144 171.297C119.95 161.851 126.936 156.355 136.257 157.484C138.199 157.719 140.996 157.406 142.209 156.174C166.903 131.106 196.243 113.33 228.755 100.441C230.291 99.8322 231.799 99.1525 233.424 98.4617C235.512 101.872 237.575 105.239 239.938 109.098C207.674 120.637 178.66 137.268 153.742 161.275Z" fill="currentColor"/>
        <path d="M571.072 372.723C570.498 375.864 571.011 377.933 573.061 380.222C578.402 386.188 577.25 394.892 571.009 399.593C564.669 404.368 556.209 402.971 551.786 396.419C547.287 389.754 549.344 381.205 556.227 376.922C557.569 376.087 558.923 374.31 559.154 372.797C562.253 352.49 562.253 332.137 559.364 311.81C559.133 310.184 557.948 308.272 556.617 307.295C550.104 302.517 548.476 293.671 553.24 287.49C557.84 281.522 566.464 280.667 572.337 285.598C578.243 290.556 578.236 299.368 572.679 305.585C571.5 306.904 571.013 309.31 571.07 311.19C571.513 325.94 572.371 340.68 572.649 355.431C572.755 361.037 571.677 366.666 571.072 372.723Z" fill="currentColor"/>
        <path d="M499.417 161.083C505.245 168.086 505.041 175.659 499.161 180.741C493.783 185.389 485.27 185 480.971 179.14C478.991 176.44 478.823 172.434 477.724 169.057C477.074 167.059 476.739 164.582 475.362 163.252C450.063 138.812 420.087 122.127 387.12 110.466C385.252 109.805 383.41 109.068 381.192 108.228C382.251 106.376 383.194 104.721 384.143 103.069C385.036 101.513 385.935 99.96 386.991 98.1307C405.617 104.601 423.466 112.459 440.473 122.289C456.55 131.582 470.959 143.001 484.558 155.559C485.881 156.78 488.189 156.932 490.037 157.587C493.076 158.663 496.113 159.745 499.417 161.083Z" fill="currentColor"/>
        <path d="M62.7092 282.699C74.6054 288.561 75.4686 300.42 65.0264 307.621C63.8229 308.451 62.9513 310.415 62.7568 311.958C59.1083 340.905 60.9426 369.631 66.4804 398.19C66.7297 399.476 66.9447 400.768 67.1968 402.175C63.0384 402.175 59.0829 402.175 54.5302 402.175C53.4208 394.207 51.9309 386.396 51.3259 378.518C50.2849 364.964 49.3688 351.373 49.2241 337.789C49.1274 328.699 50.5383 319.598 51.0672 310.491C51.1589 308.912 50.6693 306.883 49.6741 305.73C44.9886 300.3 43.8593 294.27 46.9075 288.834C49.8681 283.555 55.2742 281.376 62.7092 282.699Z" fill="currentColor"/>
      </g>
    </svg>
  )
}

function SAGIELogoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 15131 8381" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* S */}
      <g data-letter="S">
        <path data-p="s-top" d="M2081.12 1784.18C2064.2 1552.13 2053.64 1332.25 2028.15 1114.11C2010.55 963.436 1926.73 852.369 1758.96 801.017C1643.13 945.155 1481.2 996.742 1286.39 985.132C1073.99 972.474 875.666 772.825 861.768 560.815C841.561 252.553 996.044 74.638 1247.78 14.5981C1399.8 -21.6589 1541.97 9.93338 1646.05 105.901C1747.34 199.302 1856.05 250.89 1982.79 284.439C2330.97 376.603 2525.43 615.142 2596.37 956.099C2628.78 1111.9 2646.29 1273.29 2648.35 1432.43C2654.81 1931.64 2650.73 2430.98 2650.73 2939C2452.43 2939 2256.96 2939 2081.12 2939C2081.12 2557.82 2081.12 2177.45 2081.12 1784.18ZM1097.27 525.507C1130.14 696.032 1242.29 775.413 1413.98 749.664C1504.09 736.15 1621.07 581.416 1615.04 483.715C1608.12 371.62 1457.58 232.592 1343.26 232.729C1227.18 232.868 1108.84 363.457 1097.27 525.507Z" fill="currentColor"/>
        <path data-p="s-main" d="M2695.5 5518.6C2701.61 5968.76 2717.36 6408.82 2696.66 6847.17C2683.37 7128.58 2689.47 7417.5 2558.06 7685.55C2427.78 7951.3 2215.68 8098.26 1939.17 8170.06C1904.21 8179.14 1868.32 8184.62 1846.61 8189C1864.1 8070.57 1910.18 7946.07 1892.62 7831.28C1869.3 7678.83 1868.67 7564.12 1995.2 7448.51C2055.08 7393.78 2074.18 7273.43 2077.43 7181.6C2093.5 6727.41 2104.27 6272.82 2103.86 5818.38C2103.68 5620.38 2077.57 5421.77 2053.85 5224.56C2010.25 4862.08 1807.99 4701.67 1459.01 4602.24C1195.97 4527.3 928.693 4463.34 672.353 4369.76C330.922 4245.12 148.051 3973.92 90.4313 3625.92C48.479 3372.54 21.4246 3114.85 12.894 2858.25C0.164056 2475.33 -9.30275 2090.45 15.4536 1708.7C35.9669 1392.39 2.98181 1067.62 136.267 761.233C234.376 535.705 547.271 255.721 841.097 271.65C763.881 434.352 765.692 593.326 848.835 753.791C861.176 777.61 841.005 837.035 816.791 857.856C668.817 985.098 631.467 1149.15 629.609 1334.36C625.181 1775.94 603.333 2217.59 609.044 2658.95C612.36 2915.3 654.368 3171.24 680.753 3427.19C713.204 3741.96 925.688 3867.94 1204.79 3931.57C1508.05 4000.7 1812.19 4061.72 2094.57 4208.14C2401.55 4367.33 2551.47 4628.46 2621.09 4944.11C2661.67 5128.1 2667.97 5319.63 2695.5 5518.6Z" fill="currentColor"/>
        <path data-p="s-lower" d="M604.362 5358.74C605.081 5577.9 605.135 5784.56 605.144 5991.22C605.16 6344.38 595.551 6697.9 608.61 7050.58C616.954 7275.95 640.102 7509.2 895.827 7629.53C925.78 7601.14 965.498 7573.75 991.766 7536.81C1109.39 7371.42 1395.2 7373.69 1527.45 7418.01C1765.73 7497.86 1862.19 7726.99 1845.08 7919.21C1827.63 8115.19 1708.83 8283.86 1497.55 8351.97C1343.36 8401.67 1194.77 8388.82 1072.06 8284.75C933.604 8167.31 755.11 8172.56 599.472 8108.33C287.438 7979.56 124.297 7735.63 66.9002 7431.08C-44.8228 6838.25 24.3083 6235.56 12.1062 5637.18C10.0759 5537.61 35.4761 5437.47 50.5699 5319C232.119 5327.94 417.898 5337.09 604.362 5358.74ZM1301.32 8144.2C1484.05 8139.11 1639.4 7996.79 1613.65 7858.08C1587.09 7714.98 1445.95 7610.94 1301.23 7627.78C1174.02 7642.58 1093.36 7759 1095.95 7913.09C1098.08 8040.3 1200.2 8078.76 1301.32 8144.2Z" fill="currentColor"/>
      </g>
      {/* A */}
      <g data-letter="A">
        <path data-p="a-main" d="M3789.91 4501.16C3833.01 4090.5 3879.05 3692.16 3918.26 3293.16C3948.91 2981.22 3967.34 2668.07 3998.11 2356.13C4027.49 2058.29 4068.77 1761.63 4099.2 1463.87C4121.61 1244.62 4133.02 1024.26 4152.98 804.726C4169.05 627.979 4190.58 451.727 4210.57 267C4588.43 267 4970.72 267 5353 267C5086.89 356.821 4906.62 526.988 4871.64 824.716C4817.02 824.716 4765.93 824.716 4701.22 824.716C4681.99 1002.58 4658.55 1176.73 4645.32 1351.65C4624.14 1631.48 4612.57 1912.04 4591.8 2191.9C4559.78 2623.09 4525.27 3054.12 4488.33 3484.91C4456.53 3855.78 4419.86 4226.23 4385.34 4596.87C4350.82 4967.49 4316.3 5338.11 4281.78 5708.73C4247.26 6079.35 4212.43 6449.95 4178.31 6820.6C4143.4 7199.81 4109.96 7579.16 4073.93 7958.26C4067.6 8024.79 4051.63 8090.41 4038.81 8164C3843.52 8164 3642.53 8164 3434 8164C3450.53 7964.49 3464.89 7764.58 3484.48 7565.19C3495.56 7452.36 3519.83 7340.8 3530.16 7227.94C3566.84 6827.38 3598.52 6426.37 3635.09 6025.8C3667.37 5672.23 3702.94 5318.96 3738.52 4965.7C3753.73 4814.68 3772.67 4664.03 3789.91 4501.16Z" fill="currentColor"/>
      </g>
      {/* G */}
      <g data-letter="G">
        <path data-p="g-body" d="M7725.59 6179.9C7734.23 6518.06 7733.38 6843.94 7755.42 7168.27C7766.79 7335.75 7796.8 7510.77 7977.1 7603.02C7996.66 7613.03 8015.63 7663.42 8007.05 7682.86C7928.73 7860.36 7978.17 8023.42 8061 8200C7862.29 8172.21 7683.33 8119.24 7525.5 8008.95C7304.39 7854.45 7208.76 7625.79 7184.11 7370.18C7155.56 7074.16 7133.01 6776.26 7132.05 6479.1C7127.05 4924.32 7125.88 3369.49 7133.19 1814.73C7134.53 1528.53 7164.57 1239.87 7210.65 957.103C7277.11 549.236 7546.29 330.928 7944.27 258.036C7963.75 254.469 7982.65 247.765 8014.7 239C8007.48 275.848 8005.55 308.83 7994.44 338.372C7946.07 466.989 7971.21 589.171 8013.3 713.97C8023.89 745.363 8010.59 810.545 7987.63 823.36C7807.23 924.05 7759.34 1097.83 7754.83 1275.95C7737.88 1945.53 7735.61 2615.47 7725 3285.23C7719.77 3614.83 7700.09 3944.36 7701.44 4273.87C7704.02 4904.92 7716.95 5535.94 7725.59 6179.9Z" fill="currentColor"/>
        <path data-p="g-top" d="M9267.92 315.618C9618.39 461.353 9795.63 735.135 9818.36 1083.87C9855.89 1659.78 9859.2 2237.95 9873.96 2815.24C9875.06 2858.23 9852.37 2901.83 9841.04 2944C9645.02 2944 9456.01 2944 9248.01 2944C9256.39 2869.93 9271.05 2800.44 9270.99 2730.97C9270.67 2336.34 9269.7 1941.67 9262.64 1547.12C9260.15 1408.2 9252.31 1266.89 9223.05 1131.82C9204.72 1047.22 9154.36 961.33 9096.36 895.228C8984.05 767.207 8961.64 766.541 8845.44 889.282C8732.98 1008.07 8391.26 1019.66 8229.83 902.264C8059.53 778.417 7984.45 518.191 8071.41 312.732C8217.07 -31.4427 8665.57 -112.202 8920.92 195.088C8937.48 215.014 8969.97 224.197 8996.85 232.715C9083.67 260.226 9171.34 285.09 9267.92 315.618ZM8629.72 269.189C8531.86 200.424 8434.45 245.839 8371.78 307.658C8315.97 362.722 8274.7 459.808 8275.2 538.041C8275.99 661.392 8383.6 740.796 8497.76 750.743C8668.06 765.581 8739.73 678.887 8779.34 586.011C8828.17 471.492 8774.11 363.187 8629.72 269.189Z" fill="currentColor"/>
        <path data-p="g-accent" d="M9277.85 7262.84C9286.49 7210.77 9302.49 7170.12 9302.56 7129.46C9303.98 6293.59 9303.62 5457.71 9303.3 4621.84C9303.29 4609.87 9299.29 4597.9 9295.43 4576.24C9016.3 4576.24 8738.47 4576.24 8455.52 4576.24C8455.52 4391.78 8455.52 4217.56 8455.52 4038C8935.91 4038 9411.8 4038 9898.52 4038C9898.52 4084.04 9898.52 4125.91 9898.52 4167.77C9898.52 5124.29 9903.65 6080.85 9894.81 7037.28C9892.67 7269.25 9855.16 7500.19 9749.11 7717.98C9619.37 7984.42 9393.48 8106.06 9126.48 8167.11C9007.24 8194.37 8897.48 8222.75 8797 8298.17C8646.41 8411.19 8419.55 8407.43 8255.16 8293.74C8083.47 8175.02 8008.74 8007.56 8036.74 7798.45C8060.96 7617.52 8215.53 7443.99 8391.81 7397.24C8610.19 7339.31 8834.52 7433.9 8972.15 7645.35C9152.8 7586.59 9254.99 7463.86 9277.85 7262.84ZM8347.81 7690.92C8325.32 7730.44 8281.54 7771.77 8284.7 7809.12C8291.61 7890.73 8300.13 7990.53 8349.66 8045.02C8398.83 8099.1 8514.86 8147.55 8573.2 8125.02C8657.61 8092.42 8741.63 8004.97 8779.66 7920.22C8824.07 7821.23 8766.24 7717.02 8670.91 7660.72C8570.16 7601.23 8463.2 7607.61 8347.81 7690.92Z" fill="currentColor"/>
      </g>
      {/* I */}
      <g data-letter="I">
        <path data-p="i-body" d="M5595.42 4742.04C5567.83 4508.43 5545.88 4285.38 5524.74 4062.26C5490.04 3695.85 5455.3 3329.45 5421.78 2962.94C5410.96 2844.58 5403.6 2725.9 5395.21 2607.33C5369.13 2238.78 5344.31 1870.13 5316.37 1501.72C5311.99 1443.87 5293.9 1387.05 5281.59 1327.06C4943.21 1176.73 4894.66 918.557 4982.07 662.891C5084.8 362.442 5399.53 279.73 5685.47 414.891C5913.43 522.65 6025.57 839.193 5857.2 1117.69C5807.11 1200.55 5806.97 1267.98 5825.86 1354.74C5848.22 1457.39 5850.36 1564.41 5861.4 1669.51C5895.83 1997.08 5932.23 2324.46 5964.12 2652.27C5985.04 2867.42 5995.65 3083.59 6017.75 3298.61C6048.36 3596.4 6087.17 3893.35 6119.13 4191.02C6139.91 4384.61 6152.67 4579.05 6172.71 4772.73C6205.28 5087.56 6242.13 5401.94 6274.7 5716.77C6294.74 5910.46 6308.09 6104.84 6328.13 6298.53C6360.7 6613.34 6397.74 6927.7 6430.07 7242.54C6450.4 7440.51 6465.42 7639.02 6483.14 7837.26C6492.56 7942.68 6502.65 8048.03 6514 8170.28C6323.68 8170.28 6139.65 8173.47 5956.02 8166.4C5932.08 8165.48 5892.77 8113.32 5890 8082.27C5859.81 7744.29 5837.47 7405.61 5809.04 7067.45C5776.77 6683.61 5740.78 6300.08 5705.82 5916.47C5680.47 5638.38 5653.8 5360.4 5628.44 5082.31C5618.42 4972.49 5610.36 4862.49 5595.42 4742.04ZM5209.67 963.525C5218.28 973.041 5227.55 982.044 5235.39 992.152C5320.49 1101.85 5427.38 1134.92 5532.72 1083.85C5638.32 1032.65 5722.58 901.801 5703.7 818.324C5674.25 688.131 5554.11 591.734 5424.58 594.371C5254.77 597.827 5177.78 716.172 5209.67 963.525Z" fill="currentColor"/>
        <path data-p="i-line" d="M10961 2068.47C10961 1461.98 10961 868.41 10961 267C11157.7 267 11349.8 267 11550 267C11550 1414.96 11550 2566.1 11550 3724C11452.4 3697.41 11357.1 3651.86 11261.3 3650.85C11165.1 3649.85 11068.4 3693.21 10961 3719.82C10961 3172.17 10961 2626.78 10961 2068.47Z" fill="currentColor"/>
        <path data-p="i-accent" d="M11735.2 4352.56C11688.4 4433.08 11639.9 4500.38 11602.3 4573.34C11578.8 4618.97 11559.4 4673.09 11559.3 4723.45C11556.9 5822.28 11557.4 6921.12 11557.4 8019.96C11557.4 8066.39 11557.4 8112.83 11557.4 8165C11357.2 8165 11165.7 8165 10962.6 8165C10962.6 8116.04 10962.6 8069.96 10962.6 8023.88C10962.6 6985.37 10962.7 5946.86 10962.5 4908.35C10962.5 4756.41 10969.7 4617.69 10843.7 4483.41C10698.5 4328.84 10728.2 4123.22 10837.9 3947.69C10949 3769.98 11123.6 3694.97 11328.7 3725.71C11523.6 3754.91 11670.6 3864.89 11723.5 4061.32C11747.4 4149.67 11734.4 4247.96 11735.2 4352.56ZM11142 3982.2C11090.9 4059.95 11020.4 4131.75 10994.1 4217.15C10968.8 4299.41 11094.4 4448.48 11185.6 4468.37C11297.3 4492.72 11396.3 4464.72 11467.5 4368.86C11529.9 4284.72 11526.1 4122.79 11444.6 4043.64C11368.8 3970.02 11274.6 3920.1 11142 3982.2Z" fill="currentColor"/>
      </g>
      {/* E */}
      <g data-letter="E">
        <path data-p="e-main" d="M13397.3 6206.01C13397.3 6593.64 13398.5 6968.34 13395.7 7343.02C13395.4 7385.85 13386.6 7442.98 13358.7 7468.97C13142 7670.6 13116.7 7859.75 13212.7 8165C13078.8 8165 12946.7 8165 12807 8165C12807 5536.24 12807 2906.71 12807 268C12937.1 268 13073 268 13214.4 268C13153.9 450.733 13115.8 633.879 13235.3 809.795C13244.5 823.333 13244.8 847.529 13256.4 854.018C13432.9 952.398 13397 1120.26 13397.1 1275.5C13397.6 2055.04 13396.3 2834.59 13398.8 3614.12C13399.1 3695.82 13382.6 3756.66 13320 3816.48C13108.5 4018.51 13098.4 4389.72 13321.2 4597.56C13363.8 4637.34 13393.3 4712.57 13394.1 4771.86C13399.9 5245.55 13397.3 5719.33 13397.3 6206.01Z" fill="currentColor"/>
        <path data-p="e-top" d="M15130.3 795.027C15089 813.883 15048.5 825.429 15007.9 825.811C14805.4 827.714 14602.9 825.926 14400.4 826.937C14258.4 827.646 14132.9 822.739 14003 939.848C13851.4 1076.54 13640.6 1075.16 13453.8 956.384C13292.2 853.576 13203.4 704.365 13217.4 514.058C13231.6 321.762 13319.4 162.306 13508.4 86.2828C13676.4 18.6555 13945.2 30.562 14058.3 183.595C14106.9 249.394 14169.6 261.653 14247.5 260.563C14536 256.533 14824.5 258.96 15131 258.96C15131 434.741 15131 608.656 15130.3 795.027ZM13930.6 669.428C13942.3 622.355 13962.8 575.504 13964 528.167C13967 409.096 13877.4 301.602 13770.6 284.937C13631.2 263.186 13512.1 341.484 13465.4 485.576C13436.3 575.164 13503.9 727.547 13592 771.242C13713.4 831.432 13834.4 798.821 13930.6 669.428Z" fill="currentColor"/>
        <path data-p="e-mid" d="M13215 4257.45C13211.4 3771.15 13632.4 3619.92 13961.6 3773.64C13969.3 3777.25 13981.8 3777 13985.1 3782.65C14098.1 3971.35 14283.5 3929.11 14455.1 3929.79C14640.1 3930.53 14825.2 3929.96 15019 3929.96C15019 4106.75 15019 4280.92 15019 4473.04C14807.9 4473.04 14590.2 4476.84 14372.6 4471.66C14235.7 4468.41 14133.9 4501.93 14015.5 4594.25C13704.4 4836.9 13329.8 4683.06 13234.8 4301.34C13231.8 4289.56 13222 4279.5 13215 4257.45ZM13965.8 4180.08C13932.9 4009.54 13820.7 3930.15 13649 3955.9C13558.8 3969.42 13441.8 4124.17 13447.8 4221.88C13454.8 4333.99 13605.3 4473.03 13719.7 4472.89C13835.8 4472.75 13954.2 4342.15 13965.8 4180.08Z" fill="currentColor"/>
        <path data-p="e-bottom" d="M13661.4 8377.23C13390 8348.54 13251.6 8186.3 13216.5 7936.79C13186.2 7721.61 13357.7 7473.37 13556.6 7419.36C13781.6 7358.23 13966.2 7417.69 14120.8 7590.45C14142.6 7614.71 14190.9 7624.74 14227 7625.07C14523.5 7627.75 14820.1 7626.58 15124 7626.58C15124 7806.39 15124 7980.54 15124 8170.16C14844 8170.16 14561.5 8174.63 14279.3 8167.79C14177.2 8165.32 14099.9 8186.48 14033.9 8267.94C13940.6 8383.12 13807 8385.24 13661.4 8377.23ZM13738.7 7627.37C13676.6 7648.23 13599.1 7652.82 13556.2 7693.73C13490.7 7756.09 13419.7 7828.81 13463.9 7944.38C13504.7 8050.96 13554 8138.38 13681.8 8144.01C13828.4 8150.46 13946 8069.53 13965.7 7950.91C13988.9 7811.06 13906.5 7687.3 13738.7 7627.37Z" fill="currentColor"/>
      </g>
    </svg>
  )
}

/* ─────────────────────────────────────────────
   ICON CONFIG
   ───────────────────────────────────────────── */
const ICONS = [
  { name: 'Community' as const, page: '/eco', dark: '/icons/Dark/Community-icon-white.svg', light: '/icons/Light/Community-icon-black.svg', viewBox: '0 0 623 673', center: [311, 336] },
  { name: 'Events' as const, page: '/events', dark: '/icons/Dark/Events-icon-white.svg', light: '/icons/Light/Events-icon-black.svg', viewBox: '0 0 682 518', center: [341, 259] },
  { name: 'Resources' as const, page: '/resources', dark: '/icons/Dark/Resources-icon-white.svg', light: '/icons/Light/Resources-icon-black.svg', viewBox: '0 0 552 687', center: [276, 343] },
  { name: 'Ventures' as const, page: '/ventures', dark: '/icons/Dark/Ventures-icon-white.svg', light: '/icons/Light/Ventures-icon-black.svg', viewBox: '0 0 1024 1024', center: [512, 512] },
  { name: 'Solutions' as const, page: '/solutions', dark: '/icons/Dark/Solutions-icon-white.svg', light: '/icons/Light/Solutions-icon-black.svg', viewBox: '0 0 773 500', center: [386, 250] },
  { name: 'SAGIE Logo' as const, page: '/', dark: '/icons/Dark/Community-icon-white.svg', light: '/icons/Light/Community-icon-black.svg', viewBox: '0 0 15131 8381', center: [7565, 4190] },
] as const

/* ─────────────────────────────────────────────
   ANIMATION DEFINITIONS
   ───────────────────────────────────────────── */
type Engine = 'css' | 'motion' | 'gsap'
type EntryAnim = 'none' | 'fade-rise' | 'scale-snap' | 'slide-right' | 'rotate-in' | 'blur-in' | 'drop-in' | 'stagger-paths' | 'flip-x' | 'flip-y' | 'elastic' | 'spiral-in' | 'wipe-up' | 'glitch-in' | 'zoom-blur' | 'swing-in' | 'typewriter' | 'unfold' | 'shatter-in' | 'curtain'
type IdleAnim = 'none' | 'float' | 'breathe' | 'pulse-glow' | 'slow-rotate' | 'pendulum' | 'orbit-ring' | 'shimmer' | 'jello' | 'heartbeat' | 'magnetic' | 'glitch-loop' | 'color-shift' | 'shadow-dance' | 'figure-8' | 'wave' | 'rubber-band' | 'orbit' | 'flicker' | 'morph-pulse' | 'tilt-drift'
type HoverEffect = 'none' | 'glow-surge' | 'scale-lift' | 'tilt-3d' | 'color-invert' | 'shake' | 'spin-once' | 'blur-sharpen' | 'stagger-glow' | 'border-trace' | 'neon-flicker'

const ENTRY_ANIMS: { id: EntryAnim; label: string; desc: string }[] = [
  { id: 'none', label: 'None', desc: 'No entry animation' },
  { id: 'fade-rise', label: 'Fade + Rise', desc: 'Opacity 0→1, translateY 30→0 (hero text style)' },
  { id: 'scale-snap', label: 'Scale Snap', desc: 'Scale 0.8→1.03→1 with opacity (snappy overshoot)' },
  { id: 'slide-right', label: 'Slide from Right', desc: 'Slides in from +60px right with fade' },
  { id: 'rotate-in', label: 'Rotate In', desc: 'Rotate -15 to 0 with scale and fade' },
  { id: 'blur-in', label: 'Blur In', desc: 'Blur 20px to 0 with opacity fade' },
  { id: 'drop-in', label: 'Drop In', desc: 'Falls from above with bounce easing' },
  { id: 'stagger-paths', label: 'Stagger Paths', desc: 'Each SVG path fades in sequentially (GSAP only, inline SVG)' },
  { id: 'flip-x', label: 'Flip X', desc: '3D flip on horizontal axis (card flip reveal)' },
  { id: 'flip-y', label: 'Flip Y', desc: '3D flip on vertical axis (door opening)' },
  { id: 'elastic', label: 'Elastic', desc: 'Bouncy elastic spring overshoot with multiple oscillations' },
  { id: 'spiral-in', label: 'Spiral In', desc: 'Rotate 180 + scale from 0.3 to 1 (dramatic entrance)' },
  { id: 'wipe-up', label: 'Wipe Up', desc: 'Clip-path reveal from bottom to top' },
  { id: 'glitch-in', label: 'Glitch In', desc: 'Digital glitch with skew/offset jumps then settle' },
  { id: 'zoom-blur', label: 'Zoom Blur', desc: 'Scale from 2x with heavy blur, crashes into place' },
  { id: 'swing-in', label: 'Swing In', desc: 'Swings from top pivot point like a hanging sign' },
  { id: 'typewriter', label: 'Typewriter', desc: 'Clip-path reveals left to right like scanning (CSS only)' },
  { id: 'unfold', label: 'Unfold', desc: 'scaleY from 0 to 1 (unfolds vertically from center)' },
  { id: 'shatter-in', label: 'Shatter In', desc: 'Each path flies in from a random offset (GSAP + inline SVG)' },
  { id: 'curtain', label: 'Curtain', desc: 'Clip-path circle reveals from center outward' },
]

const IDLE_ANIMS: { id: IdleAnim; label: string; desc: string }[] = [
  { id: 'none', label: 'None', desc: 'Static after entry' },
  { id: 'float', label: 'Float', desc: 'Gentle vertical bobbing (+-8px, 3s loop)' },
  { id: 'breathe', label: 'Breathe', desc: 'Subtle scale 1 to 1.04 with opacity shift' },
  { id: 'pulse-glow', label: 'Pulse Glow', desc: 'Drop-shadow breathing (matches logo glow)' },
  { id: 'slow-rotate', label: 'Slow Rotate', desc: 'Full 360 rotation over 20s' },
  { id: 'pendulum', label: 'Pendulum', desc: 'Gentle rotate -3 to 3 swing' },
  { id: 'orbit-ring', label: 'Orbit Ring', desc: 'Ring group rotates, center stays fixed (Community only, inline SVG)' },
  { id: 'shimmer', label: 'Shimmer', desc: 'Traveling light highlight sweeps across (CSS gradient mask)' },
  { id: 'jello', label: 'Jello', desc: 'Playful wobble/skew distortion' },
  { id: 'heartbeat', label: 'Heartbeat', desc: 'Quick double pulse like a heartbeat rhythm' },
  { id: 'magnetic', label: 'Magnetic', desc: 'Follows cursor position slightly (interactive, Motion only)' },
  { id: 'glitch-loop', label: 'Glitch Loop', desc: 'Periodic digital glitch offset every few seconds' },
  { id: 'color-shift', label: 'Color Shift', desc: 'Hue rotation cycle (rainbow tint)' },
  { id: 'shadow-dance', label: 'Shadow Dance', desc: 'Animated drop-shadow orbits around the icon' },
  { id: 'figure-8', label: 'Figure 8', desc: 'Traces a figure-8 / lemniscate path continuously' },
  { id: 'wave', label: 'Wave', desc: 'Subtle wave with skewX oscillation' },
  { id: 'rubber-band', label: 'Rubber Band', desc: 'Periodic squish and stretch (scaleX/scaleY)' },
  { id: 'orbit', label: 'Orbit', desc: 'Circular orbit around a small center point' },
  { id: 'flicker', label: 'Flicker', desc: 'Subtle opacity flicker like a candle (0.85 to 1)' },
  { id: 'morph-pulse', label: 'Morph Pulse', desc: 'Alternating scaleX/scaleY asymmetric pulse' },
  { id: 'tilt-drift', label: 'Tilt Drift', desc: 'Slow rotateX/rotateY drift in 3D space' },
]

const HOVER_EFFECTS: { id: HoverEffect; label: string; desc: string }[] = [
  { id: 'none', label: 'None', desc: 'No hover effect' },
  { id: 'glow-surge', label: 'Glow Surge', desc: 'On hover: glow drop-shadow intensifies (silver glow breathing out)' },
  { id: 'scale-lift', label: 'Scale Lift', desc: 'On hover: scale 1.05 + translateY -4px + shadow appears' },
  { id: 'tilt-3d', label: 'Tilt 3D', desc: 'On hover: 3D perspective tilt following cursor position within the icon' },
  { id: 'color-invert', label: 'Color Invert', desc: 'On hover: filter invert(1) with smooth transition' },
  { id: 'shake', label: 'Shake', desc: 'On hover: quick shake/vibrate keyframe' },
  { id: 'spin-once', label: 'Spin Once', desc: 'On hover: rotate 360 once' },
  { id: 'blur-sharpen', label: 'Blur Sharpen', desc: 'Starts slightly blurred (2px), sharpens to 0 on hover' },
  { id: 'stagger-glow', label: 'Stagger Glow', desc: 'On hover: each SVG path gets a sequential glow (GSAP, inline only)' },
  { id: 'border-trace', label: 'Border Trace', desc: 'On hover: outline that traces around the icon (CSS)' },
  { id: 'neon-flicker', label: 'Neon Flicker', desc: 'On hover: neon-style text-shadow flicker' },
]

/* ─────────────────────────────────────────────
   MOTION VARIANTS
   ───────────────────────────────────────────── */
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

function getMotionEntry(entry: EntryAnim, speed: number) {
  const dur = 0.8 / speed
  switch (entry) {
    case 'fade-rise':
      return { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: dur, ease: EASE_OUT } }
    case 'scale-snap':
      return { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { duration: dur, ease: EASE_OUT } }
    case 'slide-right':
      return { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 }, transition: { duration: dur, ease: EASE_OUT } }
    case 'rotate-in':
      return { initial: { opacity: 0, rotate: -15, scale: 0.9 }, animate: { opacity: 1, rotate: 0, scale: 1 }, transition: { duration: dur * 1.2, ease: EASE_OUT } }
    case 'blur-in':
      return { initial: { opacity: 0, filter: 'blur(20px)' }, animate: { opacity: 1, filter: 'blur(0px)' }, transition: { duration: dur } }
    case 'drop-in':
      return { initial: { opacity: 0, y: -80 }, animate: { opacity: 1, y: 0 }, transition: { duration: dur, type: 'spring' as const, bounce: 0.35 } }
    case 'flip-x':
      return { initial: { opacity: 0, rotateX: 90 }, animate: { opacity: 1, rotateX: 0 }, transition: { duration: dur * 1.2, ease: EASE_OUT }, style: { perspective: 800 } }
    case 'flip-y':
      return { initial: { opacity: 0, rotateY: -90 }, animate: { opacity: 1, rotateY: 0 }, transition: { duration: dur * 1.2, ease: EASE_OUT }, style: { perspective: 800 } }
    case 'elastic':
      return { initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1 }, transition: { duration: dur * 1.5, type: 'spring' as const, stiffness: 300, damping: 10 } }
    case 'spiral-in':
      return { initial: { opacity: 0, rotate: 180, scale: 0.3 }, animate: { opacity: 1, rotate: 0, scale: 1 }, transition: { duration: dur * 1.5, ease: EASE_OUT } }
    case 'wipe-up':
      return { initial: { clipPath: 'inset(100% 0 0 0)' }, animate: { clipPath: 'inset(0% 0 0 0)' }, transition: { duration: dur, ease: EASE_OUT } }
    case 'glitch-in':
      return { initial: { opacity: 0, x: -20, skewX: -10 }, animate: { opacity: [0, 1, 1, 1, 1], x: [-20, 15, -8, 3, 0], skewX: [-10, 5, -3, 1, 0] }, transition: { duration: dur * 1.2, times: [0, 0.2, 0.5, 0.8, 1] } }
    case 'zoom-blur':
      return { initial: { opacity: 0, scale: 2, filter: 'blur(30px)' }, animate: { opacity: 1, scale: 1, filter: 'blur(0px)' }, transition: { duration: dur * 1.2, ease: EASE_OUT } }
    case 'swing-in':
      return { initial: { opacity: 0, rotate: -60, originY: 0 }, animate: { opacity: 1, rotate: 0 }, transition: { duration: dur * 1.5, type: 'spring' as const, stiffness: 200, damping: 12 }, style: { transformOrigin: 'top center' } }
    case 'unfold':
      return { initial: { scaleY: 0, opacity: 0 }, animate: { scaleY: 1, opacity: 1 }, transition: { duration: dur, ease: EASE_OUT }, style: { transformOrigin: 'center center' } }
    case 'curtain':
      return { initial: { clipPath: 'circle(0% at 50% 50%)' }, animate: { clipPath: 'circle(75% at 50% 50%)' }, transition: { duration: dur * 1.2, ease: EASE_OUT } }
    default:
      return { initial: {}, animate: {} }
  }
}

function getMotionIdle(idle: IdleAnim, speed: number) {
  const dur = 3 / speed
  const easeInOut = 'easeInOut' as const
  const linear = 'linear' as const
  switch (idle) {
    case 'float':
      return { animate: { y: [0, -8, 0] }, transition: { duration: dur, repeat: Infinity, ease: easeInOut } }
    case 'breathe':
      return { animate: { scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }, transition: { duration: dur, repeat: Infinity, ease: easeInOut } }
    case 'pulse-glow':
      return { animate: { filter: ['drop-shadow(0 0 8px rgba(192,192,192,0.15))', 'drop-shadow(0 0 28px rgba(192,192,192,0.5))', 'drop-shadow(0 0 8px rgba(192,192,192,0.15))'] }, transition: { duration: dur, repeat: Infinity, ease: easeInOut } }
    case 'slow-rotate':
      return { animate: { rotate: 360 }, transition: { duration: 20 / speed, repeat: Infinity, ease: linear } }
    case 'pendulum':
      return { animate: { rotate: [-3, 3, -3] }, transition: { duration: dur * 1.2, repeat: Infinity, ease: easeInOut } }
    case 'jello':
      return { animate: { skewX: [0, -4, 3, -2, 1, 0], skewY: [0, 2, -1.5, 1, -0.5, 0] }, transition: { duration: dur * 1.5, repeat: Infinity, ease: easeInOut } }
    case 'heartbeat':
      return { animate: { scale: [1, 1.08, 1, 1.12, 1] }, transition: { duration: dur * 0.6, repeat: Infinity, ease: easeInOut, repeatDelay: 1 / speed } }
    case 'glitch-loop':
      return { animate: { x: [0, -3, 5, -2, 0], skewX: [0, 2, -3, 1, 0] }, transition: { duration: 0.3 / speed, repeat: Infinity, ease: linear, repeatDelay: 3 / speed } }
    case 'color-shift':
      return { animate: { filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)'] }, transition: { duration: 8 / speed, repeat: Infinity, ease: linear } }
    case 'shadow-dance':
      return { animate: { filter: ['drop-shadow(6px 0 12px rgba(192,192,192,0.4))', 'drop-shadow(0 6px 12px rgba(192,192,192,0.4))', 'drop-shadow(-6px 0 12px rgba(192,192,192,0.4))', 'drop-shadow(0 -6px 12px rgba(192,192,192,0.4))', 'drop-shadow(6px 0 12px rgba(192,192,192,0.4))'] }, transition: { duration: dur * 2, repeat: Infinity, ease: linear } }
    case 'figure-8':
      return { animate: { x: [0, 10, 0, -10, 0], y: [0, -6, 0, 6, 0] }, transition: { duration: dur * 2, repeat: Infinity, ease: easeInOut } }
    case 'wave':
      return { animate: { skewX: [-2, 2, -2] }, transition: { duration: dur, repeat: Infinity, ease: easeInOut } }
    case 'rubber-band':
      return { animate: { scaleX: [1, 1.08, 0.95, 1.04, 1], scaleY: [1, 0.94, 1.06, 0.97, 1] }, transition: { duration: dur * 1.2, repeat: Infinity, ease: easeInOut, repeatDelay: 2 / speed } }
    case 'orbit':
      return { animate: { x: [0, 6, 0, -6, 0], y: [-4, 0, 4, 0, -4] }, transition: { duration: dur * 1.5, repeat: Infinity, ease: linear } }
    case 'flicker':
      return { animate: { opacity: [1, 0.85, 1, 0.9, 1, 0.85, 1] }, transition: { duration: dur * 0.8, repeat: Infinity, ease: easeInOut } }
    case 'morph-pulse':
      return { animate: { scaleX: [1, 1.06, 1, 0.96, 1], scaleY: [1, 0.96, 1, 1.06, 1] }, transition: { duration: dur * 1.5, repeat: Infinity, ease: easeInOut } }
    case 'tilt-drift':
      return { animate: { rotateX: [0, 8, 0, -8, 0], rotateY: [0, -6, 0, 6, 0] }, transition: { duration: dur * 3, repeat: Infinity, ease: easeInOut }, style: { perspective: 600 } }
    default:
      return {}
  }
}

/* ─────────────────────────────────────────────
   CSS ANIMATION CLASSES
   ───────────────────────────────────────────── */
function getCssEntryClass(entry: EntryAnim): string {
  const map: Record<string, string> = {
    'fade-rise': 'anim-css-fade-rise',
    'scale-snap': 'anim-css-scale-snap',
    'slide-right': 'anim-css-slide-right',
    'rotate-in': 'anim-css-rotate-in',
    'blur-in': 'anim-css-blur-in',
    'drop-in': 'anim-css-drop-in',
    'flip-x': 'anim-css-flip-x',
    'flip-y': 'anim-css-flip-y',
    'elastic': 'anim-css-elastic',
    'spiral-in': 'anim-css-spiral-in',
    'wipe-up': 'anim-css-wipe-up',
    'glitch-in': 'anim-css-glitch-in',
    'zoom-blur': 'anim-css-zoom-blur',
    'swing-in': 'anim-css-swing-in',
    'typewriter': 'anim-css-typewriter',
    'unfold': 'anim-css-unfold',
    'curtain': 'anim-css-curtain',
  }
  return map[entry] ?? ''
}

function getCssIdleClass(idle: IdleAnim): string {
  const map: Record<string, string> = {
    float: 'anim-css-float',
    breathe: 'anim-css-breathe',
    'pulse-glow': 'anim-css-pulse-glow',
    'slow-rotate': 'anim-css-slow-rotate',
    pendulum: 'anim-css-pendulum',
    shimmer: 'anim-css-shimmer',
    jello: 'anim-css-jello',
    heartbeat: 'anim-css-heartbeat',
    'glitch-loop': 'anim-css-glitch-loop',
    'color-shift': 'anim-css-color-shift',
    'shadow-dance': 'anim-css-shadow-dance',
    'figure-8': 'anim-css-figure-8',
    wave: 'anim-css-wave',
    'rubber-band': 'anim-css-rubber-band',
    orbit: 'anim-css-orbit',
    flicker: 'anim-css-flicker',
    'morph-pulse': 'anim-css-morph-pulse',
    'tilt-drift': 'anim-css-tilt-drift',
  }
  return map[idle] ?? ''
}

function getCssHoverClass(hover: HoverEffect): string {
  const map: Record<string, string> = {
    'glow-surge': 'hover-glow-surge',
    'scale-lift': 'hover-scale-lift',
    'tilt-3d': 'hover-tilt-3d',
    'color-invert': 'hover-color-invert',
    'shake': 'hover-shake',
    'spin-once': 'hover-spin-once',
    'blur-sharpen': 'hover-blur-sharpen',
    'stagger-glow': 'hover-stagger-glow',
    'border-trace': 'hover-border-trace',
    'neon-flicker': 'hover-neon-flicker',
  }
  return map[hover] ?? ''
}

/* ─────────────────────────────────────────────
   GSAP ANIMATION HOOK
   ───────────────────────────────────────────── */
function useGsapAnimation(
  ref: React.RefObject<HTMLDivElement | null>,
  entry: EntryAnim,
  idle: IdleAnim,
  speed: number,
  replay: number,
  iconName: string,
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    let ctx: ReturnType<typeof import('gsap').gsap.context> | null = null

    const init = async () => {
      const { gsap } = await getGSAP()

      ctx = gsap.context(() => {
        const tl = gsap.timeline()
        const dur = 0.8 / speed

        // Entry
        switch (entry) {
          case 'fade-rise':
            tl.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: dur, ease: 'power3.out' })
            break
          case 'scale-snap':
            tl.fromTo(el, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: dur, ease: 'back.out(1.7)' })
            break
          case 'slide-right':
            tl.fromTo(el, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: dur, ease: 'power3.out' })
            break
          case 'rotate-in':
            tl.fromTo(el, { opacity: 0, rotation: -15, scale: 0.9 }, { opacity: 1, rotation: 0, scale: 1, duration: dur * 1.2, ease: 'power3.out' })
            break
          case 'blur-in':
            tl.fromTo(el, { opacity: 0, filter: 'blur(20px)' }, { opacity: 1, filter: 'blur(0px)', duration: dur, ease: 'power2.out' })
            break
          case 'drop-in':
            tl.fromTo(el, { opacity: 0, y: -80 }, { opacity: 1, y: 0, duration: dur * 1.2, ease: 'bounce.out' })
            break
          case 'stagger-paths': {
            const paths = el.querySelectorAll('path')
            gsap.set(paths, { opacity: 0 })
            tl.to(paths, { opacity: 1, duration: 0.3 / speed, stagger: 0.08 / speed, ease: 'power2.out' })
            break
          }
          case 'flip-x':
            gsap.set(el, { perspective: 800 })
            tl.fromTo(el, { opacity: 0, rotationX: 90 }, { opacity: 1, rotationX: 0, duration: dur * 1.2, ease: 'power3.out' })
            break
          case 'flip-y':
            gsap.set(el, { perspective: 800 })
            tl.fromTo(el, { opacity: 0, rotationY: -90 }, { opacity: 1, rotationY: 0, duration: dur * 1.2, ease: 'power3.out' })
            break
          case 'elastic':
            tl.fromTo(el, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: dur * 1.5, ease: 'elastic.out(1, 0.3)' })
            break
          case 'spiral-in':
            tl.fromTo(el, { opacity: 0, rotation: 180, scale: 0.3 }, { opacity: 1, rotation: 0, scale: 1, duration: dur * 1.5, ease: 'power3.out' })
            break
          case 'wipe-up':
            tl.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: dur, ease: 'power2.out' })
            break
          case 'glitch-in':
            tl.fromTo(el, { opacity: 0, x: -20, skewX: -10 }, { opacity: 1, x: 0, skewX: 0, duration: dur * 1.2, ease: 'steps(8)' })
            break
          case 'zoom-blur':
            tl.fromTo(el, { opacity: 0, scale: 2, filter: 'blur(30px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: dur * 1.2, ease: 'power3.out' })
            break
          case 'swing-in':
            gsap.set(el, { transformOrigin: 'top center' })
            tl.fromTo(el, { opacity: 0, rotation: -60 }, { opacity: 1, rotation: 0, duration: dur * 1.5, ease: 'elastic.out(1, 0.5)' })
            break
          case 'typewriter':
            tl.fromTo(el, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: dur * 1.5, ease: 'steps(12)' })
            break
          case 'unfold':
            gsap.set(el, { transformOrigin: 'center center' })
            tl.fromTo(el, { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: dur, ease: 'power3.out' })
            break
          case 'shatter-in': {
            const paths = el.querySelectorAll('path')
            paths.forEach(p => {
              const rx = (Math.random() - 0.5) * 300
              const ry = (Math.random() - 0.5) * 300
              const rr = (Math.random() - 0.5) * 180
              gsap.set(p, { opacity: 0, x: rx, y: ry, rotation: rr })
            })
            tl.to(paths, { opacity: 1, x: 0, y: 0, rotation: 0, duration: dur * 1.5, stagger: 0.06 / speed, ease: 'power3.out' })
            break
          }
          case 'curtain':
            tl.fromTo(el, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: dur * 1.2, ease: 'power2.out' })
            break
          default:
            gsap.set(el, { opacity: 1 })
        }

        // Idle (after entry completes)
        const idleDur = 3 / speed
        switch (idle) {
          case 'float':
            tl.to(el, { y: -8, duration: idleDur / 2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
            break
          case 'breathe':
            tl.to(el, { scale: 1.04, opacity: 0.9, duration: idleDur / 2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
            break
          case 'pulse-glow':
            tl.to(el, { filter: 'drop-shadow(0 0 28px rgba(192,192,192,0.5))', duration: idleDur / 2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
            break
          case 'slow-rotate':
            tl.to(el, { rotation: 360, duration: 20 / speed, ease: 'none', repeat: -1 })
            break
          case 'pendulum':
            tl.to(el, { rotation: 3, duration: idleDur * 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
            break
          case 'orbit-ring': {
            const ring = el.querySelector('[data-part="ring"]')
            const center = el.querySelector('[data-part="center"]')
            if (ring && iconName === 'Community') {
              const cx = 311, cy = 336
              gsap.set(ring, { transformOrigin: `${cx}px ${cy}px` })
              tl.to(ring, { rotation: 360, duration: 20 / speed, ease: 'none', repeat: -1 })
              if (center) {
                gsap.set(center, { transformOrigin: `${cx}px ${cy}px` })
                tl.to(center, { rotation: -360, duration: 20 / speed, ease: 'none', repeat: -1 }, '<')
              }
            }
            break
          }
          case 'jello':
            tl.to(el, { skewX: -4, skewY: 2, duration: idleDur * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1 })
            break
          case 'heartbeat': {
            const hbTl = gsap.timeline({ repeat: -1, repeatDelay: 1 / speed })
            hbTl.to(el, { scale: 1.08, duration: 0.15 / speed, ease: 'power2.out' })
              .to(el, { scale: 1, duration: 0.1 / speed })
              .to(el, { scale: 1.12, duration: 0.15 / speed, ease: 'power2.out' })
              .to(el, { scale: 1, duration: 0.2 / speed, ease: 'power2.inOut' })
            break
          }
          case 'glitch-loop': {
            const glitchTl = gsap.timeline({ repeat: -1, repeatDelay: 3 / speed })
            glitchTl.to(el, { x: -3, skewX: 2, duration: 0.05 })
              .to(el, { x: 5, skewX: -3, duration: 0.05 })
              .to(el, { x: -2, skewX: 1, duration: 0.05 })
              .to(el, { x: 0, skewX: 0, duration: 0.05 })
            break
          }
          case 'color-shift':
            tl.to(el, { filter: 'hue-rotate(360deg)', duration: 8 / speed, ease: 'none', repeat: -1 })
            break
          case 'shadow-dance':
            tl.to(el, { filter: 'drop-shadow(6px 0 12px rgba(192,192,192,0.4))', duration: idleDur * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
            break
          case 'figure-8':
            tl.to(el, { x: 10, y: -6, duration: idleDur * 0.5, ease: 'sine.inOut' })
              .to(el, { x: 0, y: 0, duration: idleDur * 0.5, ease: 'sine.inOut' })
              .to(el, { x: -10, y: 6, duration: idleDur * 0.5, ease: 'sine.inOut' })
              .to(el, { x: 0, y: 0, duration: idleDur * 0.5, ease: 'sine.inOut', onComplete: () => { tl.restart() } })
            break
          case 'wave':
            tl.to(el, { skewX: 2, duration: idleDur * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
            break
          case 'rubber-band': {
            const rbTl = gsap.timeline({ repeat: -1, repeatDelay: 2 / speed })
            rbTl.to(el, { scaleX: 1.08, scaleY: 0.94, duration: 0.15 / speed, ease: 'power2.out' })
              .to(el, { scaleX: 0.95, scaleY: 1.06, duration: 0.15 / speed })
              .to(el, { scaleX: 1.04, scaleY: 0.97, duration: 0.1 / speed })
              .to(el, { scaleX: 1, scaleY: 1, duration: 0.2 / speed, ease: 'power2.inOut' })
            break
          }
          case 'orbit':
            tl.to(el, { x: 6, y: 0, duration: idleDur * 0.375, ease: 'sine.inOut' })
              .to(el, { x: 0, y: 4, duration: idleDur * 0.375, ease: 'sine.inOut' })
              .to(el, { x: -6, y: 0, duration: idleDur * 0.375, ease: 'sine.inOut' })
              .to(el, { x: 0, y: -4, duration: idleDur * 0.375, ease: 'sine.inOut', onComplete: () => { tl.restart() } })
            break
          case 'flicker':
            tl.to(el, { opacity: 0.85, duration: 0.1 / speed, ease: 'none', yoyo: true, repeat: -1, repeatDelay: 0.3 / speed })
            break
          case 'morph-pulse': {
            const mpTl = gsap.timeline({ repeat: -1 })
            mpTl.to(el, { scaleX: 1.06, scaleY: 0.96, duration: idleDur * 0.5, ease: 'sine.inOut' })
              .to(el, { scaleX: 0.96, scaleY: 1.06, duration: idleDur * 0.5, ease: 'sine.inOut' })
              .to(el, { scaleX: 1, scaleY: 1, duration: idleDur * 0.5, ease: 'sine.inOut' })
            break
          }
          case 'tilt-drift':
            gsap.set(el, { perspective: 600 })
            tl.to(el, { rotationX: 8, rotationY: -6, duration: idleDur, ease: 'sine.inOut', yoyo: true, repeat: -1 })
            break
        }
      }, el)
    }

    init()
    return () => { ctx?.revert() }
  }, [ref, entry, idle, speed, replay, iconName])
}

/* ─────────────────────────────────────────────
   GSAP HOVER HOOK (for stagger-glow)
   ───────────────────────────────────────────── */
function useGsapStaggerGlow(ref: React.RefObject<HTMLDivElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = ref.current
    if (!enabled || !el) return

    let ctx: ReturnType<typeof import('gsap').gsap.context> | null = null

    const init = async () => {
      const { gsap } = await getGSAP()

      const paths = el.querySelectorAll('path')
      if (paths.length === 0) return

      function onEnter() {
        gsap.to(paths, {
          filter: 'drop-shadow(0 0 12px rgba(192,192,192,0.7))',
          duration: 0.2,
          stagger: 0.04,
          ease: 'power2.out',
        })
      }

      function onLeave() {
        gsap.to(paths, {
          filter: 'drop-shadow(0 0 0px rgba(192,192,192,0))',
          duration: 0.3,
          stagger: 0.02,
          ease: 'power2.inOut',
        })
      }

      ctx = gsap.context(() => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      }, el)

      // Store cleanup refs on the element
      ;(el as HTMLDivElement & { _sgEnter?: () => void; _sgLeave?: () => void })._sgEnter = onEnter
      ;(el as HTMLDivElement & { _sgEnter?: () => void; _sgLeave?: () => void })._sgLeave = onLeave
    }

    init()

    return () => {
      ctx?.revert()
      const typedEl = el as HTMLDivElement & { _sgEnter?: () => void; _sgLeave?: () => void }
      if (typedEl._sgEnter) el.removeEventListener('mouseenter', typedEl._sgEnter)
      if (typedEl._sgLeave) el.removeEventListener('mouseleave', typedEl._sgLeave)
    }
  }, [ref, enabled])
}

/* ─────────────────────────────────────────────
   MAGNETIC (CURSOR-FOLLOW) HOOK
   ───────────────────────────────────────────── */
function useMagnetic(enabled: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!enabled || !el) {
      if (el) el.style.transform = ''
      return
    }

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) * 0.08
      const dy = (e.clientY - cy) * 0.08
      const maxD = 20
      const x = Math.max(-maxD, Math.min(maxD, dx))
      const y = Math.max(-maxD, Math.min(maxD, dy))
      el!.style.transform = `translate(${x}px, ${y}px)`
    }

    function onLeave() { el!.style.transform = 'translate(0px, 0px)' }

    el.style.transition = 'transform 0.3s ease-out'
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [enabled])

  return { ref: containerRef }
}

/* ─────────────────────────────────────────────
   TILT-3D HOVER HOOK (cursor-following perspective)
   Uses refs and direct DOM manipulation to avoid
   setState inside useEffect (lint rule).
   ───────────────────────────────────────────── */
function useTilt3d(enabled: boolean) {
  const tiltRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = tiltRef.current
    if (!enabled || !el) {
      if (el) el.style.transform = ''
      return
    }

    el.style.perspective = '600px'
    el.style.transition = 'transform 0.15s ease-out'

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)
      const rotateY = dx * 15
      const rotateX = -dy * 15
      el!.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }

    function onLeave() {
      el!.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)'
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [enabled])

  return { ref: tiltRef }
}

/* ─────────────────────────────────────────────
   ICON PREVIEW COMPONENT
   ───────────────────────────────────────────── */
function IconPreview({
  icon,
  engine,
  entry,
  idle,
  hover,
  speed,
  replay,
  useInline,
}: {
  icon: typeof ICONS[number]
  engine: Engine
  entry: EntryAnim
  idle: IdleAnim
  hover: HoverEffect
  speed: number
  replay: number
  useInline: boolean
}) {
  const gsapRef = useRef<HTMLDivElement>(null)
  const staggerGlowRef = useRef<HTMLDivElement>(null)
  const isMagnetic = idle === 'magnetic' && engine === 'motion'
  const magnetic = useMagnetic(isMagnetic)
  const isTilt3d = hover === 'tilt-3d'
  const tilt3d = useTilt3d(isTilt3d)
  useGsapAnimation(gsapRef, engine === 'gsap' ? entry : 'none', engine === 'gsap' ? idle : 'none', speed, replay, icon.name)
  useGsapStaggerGlow(staggerGlowRef, hover === 'stagger-glow' && useInline && (icon.name === 'Community' || icon.name === 'SAGIE Logo'))

  const isInlineSVG = useInline && (icon.name === 'Community' || icon.name === 'SAGIE Logo')

  const iconContent = isInlineSVG ? (
    icon.name === 'SAGIE Logo' ? (
      <SAGIELogoIcon className="w-full h-auto text-[#FAFAFA]" />
    ) : (
      <CommunityIcon className="w-full h-auto text-[#FAFAFA]" />
    )
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={icon.dark} alt="" aria-hidden="true" data-light-src={icon.light} data-icon-name={icon.name} className="w-full h-auto" />
  )

  const hoverClass = getCssHoverClass(hover)
  const hoverDataAttr = hover !== 'none' ? hover : undefined

  function renderIcon(): ReactNode {
    const key = `${icon.name}-${engine}-${entry}-${idle}-${hover}-${replay}`

    // Wrap content in hover container
    const wrapWithHover = (content: ReactNode) => {
      const combinedRef = (node: HTMLDivElement | null) => {
        if (staggerGlowRef) {
          (staggerGlowRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        }
      }

      if (isTilt3d) {
        return (
          <div ref={tilt3d.ref} className={hoverClass} data-hover={hoverDataAttr}>
            {content}
          </div>
        )
      }

      if (hover === 'stagger-glow' && isInlineSVG) {
        return (
          <div ref={combinedRef} className={hoverClass} data-hover={hoverDataAttr}>
            {content}
          </div>
        )
      }

      if (hover !== 'none') {
        return (
          <div className={hoverClass} data-hover={hoverDataAttr}>
            {content}
          </div>
        )
      }

      return content
    }

    if (engine === 'css') {
      const entryClass = getCssEntryClass(entry)
      const idleClass = getCssIdleClass(idle)
      return (
        <div key={key} className={`${entryClass} ${idleClass}`} style={{ animationDuration: `${0.8 / speed}s` }}>
          {wrapWithHover(iconContent)}
        </div>
      )
    }

    if (engine === 'motion') {
      const entryProps = getMotionEntry(entry, speed)
      const idleProps = entry === 'stagger-paths' || entry === 'shatter-in' ? {} : getMotionIdle(idle, speed)
      const noMotionIdle = idle === 'none' || idle === 'orbit-ring' || idle === 'magnetic' || idle === 'shimmer'
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            {...entryProps}
          >
            {isMagnetic ? (
              <div ref={magnetic.ref}>
                {wrapWithHover(iconContent)}
              </div>
            ) : !noMotionIdle ? (
              <motion.div {...idleProps}>
                {wrapWithHover(iconContent)}
              </motion.div>
            ) : wrapWithHover(iconContent)}
          </motion.div>
        </AnimatePresence>
      )
    }

    if (engine === 'gsap') {
      return (
        <div key={key} ref={gsapRef} style={{ opacity: entry === 'none' ? 1 : 0 }}>
          {wrapWithHover(iconContent)}
        </div>
      )
    }

    return wrapWithHover(iconContent)
  }

  return renderIcon()
}

/* ─────────────────────────────────────────────
   CONTROL BAR
   ───────────────────────────────────────────── */
type PillTag = 'gsap' | 'motion' | 'css' | 'inline' | null

const TAG_COLORS: Record<string, string> = {
  gsap: 'border-green-600/60 text-green-500/70',
  motion: 'border-blue-500/60 text-blue-400/70',
  css: 'border-orange-500/60 text-orange-400/70',
  inline: 'border-purple-500/60 text-purple-400/70',
}

function Pill({ active, onClick, children, tag, disabled }: { active: boolean; onClick: () => void; children: ReactNode; tag?: PillTag; disabled?: boolean }) {
  const tagClass = tag && !active ? TAG_COLORS[tag] : ''
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-body text-label tracking-button px-3 py-1.5 border transition-colors whitespace-nowrap ${
        disabled
          ? 'border-border-subtle/50 text-foreground-muted/30 cursor-not-allowed'
          : active
          ? 'border-foreground-secondary text-foreground-secondary bg-foreground-secondary/5'
          : tagClass || 'border-border-subtle text-foreground-muted hover:text-foreground-muted hover:border-border-default'
      }`}
    >
      {children}
    </button>
  )
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */
export default function IconMockupPage() {
  const [engine, setEngine] = useState<Engine>('motion')
  const [entry, setEntry] = useState<EntryAnim>('fade-rise')
  const [idle, setIdle] = useState<IdleAnim>('none')
  const [hover, setHover] = useState<HoverEffect>('none')
  const [speed, setSpeed] = useState(1)
  const [iconSize, setIconSize] = useState(320)
  const [showBg, setShowBg] = useState(true)
  const [activeIcon, setActiveIcon] = useState(0)
  const [useInline, setUseInline] = useState(true)
  const [replay, setReplay] = useState(0)

  const handleReplay = useCallback(() => setReplay(r => r + 1), [])

  // Tag helpers — determine what engine/mode an option requires
  function entryTag(id: EntryAnim): PillTag {
    if (id === 'stagger-paths' || id === 'shatter-in') return 'gsap'
    if (id === 'typewriter') return 'css'
    return null
  }
  function idleTag(id: IdleAnim): PillTag {
    if (id === 'orbit-ring') return 'inline'
    if (id === 'magnetic') return 'motion'
    return null
  }
  function hoverTag(id: HoverEffect): PillTag {
    if (id === 'stagger-glow') return 'inline'
    return null
  }

  function isEntryDisabled(id: EntryAnim): boolean {
    if (id === 'stagger-paths' && engine !== 'gsap') return true
    if (id === 'shatter-in' && engine !== 'gsap') return true
    if (id === 'typewriter' && engine === 'motion') return true
    return false
  }
  function isIdleDisabled(id: IdleAnim): boolean {
    if (id === 'orbit-ring' && !showOrbitRing) return true
    if (id === 'magnetic' && engine !== 'motion') return true
    return false
  }
  function isHoverDisabled(id: HoverEffect): boolean {
    if (id === 'stagger-glow' && (!isCurrentInline || engine === 'css')) return true
    return false
  }

  const currentIcon = ICONS[activeIcon === -1 ? 0 : activeIcon] ?? ICONS[0]
  const isCurrentInline = useInline && (currentIcon.name === 'Community' || currentIcon.name === 'SAGIE Logo')
  const showOrbitRing = isCurrentInline && currentIcon.name === 'Community'

  return (
    <main className="relative min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* ── LEFT SIDEBAR: Controls ── */}
        <aside className="sticky top-0 z-50 h-screen w-[340px] shrink-0 overflow-y-auto border-r border-border-strong bg-background/95 backdrop-blur-sm hidden lg:block">
          <div className="px-5 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-display uppercase text-label tracking-heading text-foreground-muted">
                Animation Lab
              </p>
              <button
                onClick={handleReplay}
                className="font-body uppercase text-label tracking-button text-foreground-muted hover:text-foreground-secondary transition-colors border border-border-subtle hover:border-foreground-secondary px-3 py-1"
              >
                Replay
              </button>
            </div>

            {/* Icon selector */}
            <div>
              <p className="font-body text-foreground-muted text-label uppercase tracking-label mb-1.5">Icon</p>
              <div className="flex flex-wrap gap-1.5">
                {ICONS.map((icon, i) => (
                  <Pill key={icon.name} active={activeIcon === i} onClick={() => setActiveIcon(i)}>
                    {icon.name}
                  </Pill>
                ))}
                <Pill active={activeIcon === -1} onClick={() => setActiveIcon(-1)}>All</Pill>
              </div>
            </div>

            {/* Engine */}
            <div>
              <p className="font-body text-foreground-muted text-label uppercase tracking-label mb-1.5">Engine</p>
              <div className="flex gap-1.5">
                {(['css', 'motion', 'gsap'] as Engine[]).map(e => (
                  <Pill key={e} active={engine === e} onClick={() => setEngine(e)}>
                    {e === 'css' ? 'CSS' : e === 'motion' ? 'Motion' : 'GSAP'}
                  </Pill>
                ))}
              </div>
            </div>

            {/* Entry */}
            <div>
              <p className="font-body text-foreground-muted text-label uppercase tracking-label mb-1.5">Entry</p>
              <div className="flex flex-wrap gap-1">
                {ENTRY_ANIMS.map(a => (
                  <Pill key={a.id} active={entry === a.id} onClick={() => !isEntryDisabled(a.id) && setEntry(a.id)} tag={entryTag(a.id)} disabled={isEntryDisabled(a.id)}>
                    {a.label}
                  </Pill>
                ))}
              </div>
              <p className="font-body text-foreground-ghost text-label mt-1">
                {ENTRY_ANIMS.find(a => a.id === entry)?.desc}
              </p>
            </div>

            {/* Idle */}
            <div>
              <p className="font-body text-foreground-muted text-label uppercase tracking-label mb-1.5">Idle</p>
              <div className="flex flex-wrap gap-1">
                {IDLE_ANIMS.map(a => (
                  <Pill key={a.id} active={idle === a.id} onClick={() => !isIdleDisabled(a.id) && setIdle(a.id)} tag={idleTag(a.id)} disabled={isIdleDisabled(a.id)}>
                    {a.label}
                  </Pill>
                ))}
              </div>
              <p className="font-body text-foreground-ghost text-label mt-1">
                {IDLE_ANIMS.find(a => a.id === idle)?.desc}
              </p>
            </div>

            {/* Hover */}
            <div>
              <p className="font-body text-foreground-muted text-label uppercase tracking-label mb-1.5">Hover</p>
              <div className="flex flex-wrap gap-1">
                {HOVER_EFFECTS.map(a => (
                  <Pill key={a.id} active={hover === a.id} onClick={() => !isHoverDisabled(a.id) && setHover(a.id)} tag={hoverTag(a.id)} disabled={isHoverDisabled(a.id)}>
                    {a.label}
                  </Pill>
                ))}
              </div>
              <p className="font-body text-foreground-ghost text-label mt-1">
                {HOVER_EFFECTS.find(a => a.id === hover)?.desc}
              </p>
            </div>

            {/* Sliders + toggles */}
            <div className="space-y-3 border-t border-border-subtle pt-4">
              <div>
                <p className="font-body text-foreground-muted text-label uppercase tracking-label mb-1">
                  Speed: {speed.toFixed(1)}x
                </p>
                <input type="range" min="0.2" max="3" step="0.1" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} className="w-full accent-foreground-secondary" />
              </div>
              <div>
                <p className="font-body text-foreground-muted text-label uppercase tracking-label mb-1">
                  Icon Size: {iconSize}px
                </p>
                <input type="range" min="80" max="600" step="10" value={iconSize} onChange={e => setIconSize(parseInt(e.target.value))} className="w-full accent-foreground-secondary" />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={useInline} onChange={e => setUseInline(e.target.checked)} className="accent-foreground-secondary" />
                  <span className="font-body text-label text-foreground-muted">Inline SVG</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showBg} onChange={e => setShowBg(e.target.checked)} className="accent-foreground-secondary" />
                  <span className="font-body text-label text-foreground-muted">Grid BG</span>
                </label>
              </div>
            </div>

            {/* Legend */}
            <div className="border-t border-border-subtle pt-3">
              <p className="font-body text-foreground-ghost text-label uppercase tracking-label mb-2">Legend</p>
              <div className="flex flex-wrap gap-2">
                <span className="font-body text-label px-2 py-0.5 border border-green-600/60 text-green-500/70">GSAP only</span>
                <span className="font-body text-label px-2 py-0.5 border border-blue-500/60 text-blue-400/70">Motion only</span>
                <span className="font-body text-label px-2 py-0.5 border border-orange-500/60 text-orange-400/70">CSS only</span>
                <span className="font-body text-label px-2 py-0.5 border border-purple-500/60 text-purple-400/70">Inline SVG</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ── RIGHT: Preview area ── */}
        <div className="flex-1 min-w-0">
          {/* Mobile controls (collapsed at top on small screens) */}
          <div className="lg:hidden sticky top-0 z-50 border-b border-border-strong bg-background/95 backdrop-blur-sm px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <p className="font-display uppercase text-label tracking-heading text-foreground-muted">Animation Lab</p>
              <button onClick={handleReplay} className="font-body uppercase text-label tracking-button text-foreground-muted border border-border-subtle px-3 py-1">Replay</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(['css', 'motion', 'gsap'] as Engine[]).map(e => (
                <Pill key={e} active={engine === e} onClick={() => setEngine(e)}>{e.toUpperCase()}</Pill>
              ))}
              {ICONS.map((icon, i) => (
                <Pill key={icon.name} active={activeIcon === i} onClick={() => setActiveIcon(i)}>{icon.name}</Pill>
              ))}
            </div>
          </div>

          {/* Icon previews — centered, using iconSize */}
          <div className="flex flex-col items-center justify-center min-h-screen py-16 px-8">
            {(activeIcon === -1 ? ICONS : [currentIcon]).map((icon) => (
              <div key={`${icon.name}-${replay}`} className="mb-16 last:mb-0">
                <div className="relative" style={{ width: iconSize, maxWidth: '90vw' }}>
                  {showBg && (
                    <div className="absolute inset-0 -m-8 z-0 overflow-hidden rounded-sm opacity-30">
                      <GridBackground parallax />
                    </div>
                  )}
                  <div className="relative z-10">
                    <IconPreview icon={icon} engine={engine} entry={entry} idle={idle} hover={hover} speed={speed} replay={replay} useInline={useInline} />
                  </div>
                </div>
                <p className="font-body text-foreground-muted text-label text-center mt-4">
                  {icon.name} · <span className="text-foreground-muted">{engine}</span> · <span className="text-foreground-muted">{entry}</span> · <span className="text-foreground-muted">{idle}</span>
                  {hover !== 'none' && <> · <span className="text-foreground-muted">{hover}</span></>}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS keyframes */}
      <style>{`
        /* ── ENTRY ── */
        @keyframes css-fade-rise {
          0%   { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .anim-css-fade-rise { animation: css-fade-rise 0.8s cubic-bezier(0.16,1,0.3,1) both; }

        @keyframes css-scale-snap {
          0%   { opacity: 0; transform: scale(0.8); }
          70%  { opacity: 1; transform: scale(1.03); }
          100% { opacity: 1; transform: scale(1); }
        }
        .anim-css-scale-snap { animation: css-scale-snap 0.8s cubic-bezier(0.16,1,0.3,1) both; }

        @keyframes css-slide-right {
          0%   { opacity: 0; transform: translateX(60px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .anim-css-slide-right { animation: css-slide-right 0.8s cubic-bezier(0.16,1,0.3,1) both; }

        @keyframes css-rotate-in {
          0%   { opacity: 0; transform: rotate(-15deg) scale(0.9); }
          100% { opacity: 1; transform: rotate(0) scale(1); }
        }
        .anim-css-rotate-in { animation: css-rotate-in 0.9s cubic-bezier(0.16,1,0.3,1) both; }

        @keyframes css-blur-in {
          0%   { opacity: 0; filter: blur(20px); }
          100% { opacity: 1; filter: blur(0px); }
        }
        .anim-css-blur-in { animation: css-blur-in 0.8s ease-out both; }

        @keyframes css-drop-in {
          0%        { opacity: 0; transform: translateY(-80px); }
          60%       { opacity: 1; transform: translateY(8px); }
          80%       { transform: translateY(-4px); }
          100%      { transform: translateY(0); }
        }
        .anim-css-drop-in { animation: css-drop-in 0.9s cubic-bezier(0.34,1.56,0.64,1) both; }

        .anim-css-flip-x { animation: css-flip-x 0.9s cubic-bezier(0.16,1,0.3,1) both; perspective: 800px; }
        @keyframes css-flip-x {
          0%   { opacity: 0; transform: rotateX(90deg); }
          100% { opacity: 1; transform: rotateX(0deg); }
        }

        .anim-css-flip-y { animation: css-flip-y 0.9s cubic-bezier(0.16,1,0.3,1) both; perspective: 800px; }
        @keyframes css-flip-y {
          0%   { opacity: 0; transform: rotateY(-90deg); }
          100% { opacity: 1; transform: rotateY(0deg); }
        }

        .anim-css-elastic { animation: css-elastic 1.2s cubic-bezier(0.68,-0.55,0.27,1.55) both; }
        @keyframes css-elastic {
          0%   { opacity: 0; transform: scale(0.5); }
          50%  { transform: scale(1.15); }
          70%  { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }

        .anim-css-spiral-in { animation: css-spiral-in 1.2s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes css-spiral-in {
          0%   { opacity: 0; transform: rotate(180deg) scale(0.3); }
          100% { opacity: 1; transform: rotate(0deg) scale(1); }
        }

        .anim-css-wipe-up { animation: css-wipe-up 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes css-wipe-up {
          0%   { clip-path: inset(100% 0 0 0); }
          100% { clip-path: inset(0% 0 0 0); }
        }

        .anim-css-glitch-in { animation: css-glitch-in 0.6s steps(8) both; }
        @keyframes css-glitch-in {
          0%   { opacity: 0; transform: translateX(-20px) skewX(-10deg); }
          20%  { opacity: 1; transform: translateX(15px) skewX(5deg); }
          40%  { transform: translateX(-8px) skewX(-3deg); }
          60%  { transform: translateX(5px) skewX(2deg); }
          80%  { transform: translateX(-2px) skewX(-1deg); }
          100% { transform: translateX(0) skewX(0deg); }
        }

        .anim-css-zoom-blur { animation: css-zoom-blur 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes css-zoom-blur {
          0%   { opacity: 0; transform: scale(2); filter: blur(30px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0px); }
        }

        .anim-css-swing-in { animation: css-swing-in 1.2s cubic-bezier(0.68,-0.55,0.27,1.55) both; transform-origin: top center; }
        @keyframes css-swing-in {
          0%   { opacity: 0; transform: rotate(-60deg); }
          60%  { transform: rotate(8deg); }
          80%  { transform: rotate(-4deg); }
          100% { opacity: 1; transform: rotate(0deg); }
        }

        .anim-css-typewriter { animation: css-typewriter 1.2s steps(12) both; }
        @keyframes css-typewriter {
          0%   { clip-path: inset(0 100% 0 0); }
          100% { clip-path: inset(0 0% 0 0); }
        }

        .anim-css-unfold { animation: css-unfold 0.8s cubic-bezier(0.16,1,0.3,1) both; transform-origin: center center; }
        @keyframes css-unfold {
          0%   { opacity: 0; transform: scaleY(0); }
          100% { opacity: 1; transform: scaleY(1); }
        }

        .anim-css-curtain { animation: css-curtain 1s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes css-curtain {
          0%   { clip-path: circle(0% at 50% 50%); }
          100% { clip-path: circle(75% at 50% 50%); }
        }

        /* ── IDLE ── */
        @keyframes css-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        .anim-css-float { animation: css-float 3s ease-in-out infinite; }

        @keyframes css-breathe {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50%      { transform: scale(1.04); opacity: 1; }
        }
        .anim-css-breathe { animation: css-breathe 3s ease-in-out infinite; }

        @keyframes css-pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(192,192,192,0.15)); }
          50%      { filter: drop-shadow(0 0 28px rgba(192,192,192,0.5)); }
        }
        .anim-css-pulse-glow { animation: css-pulse-glow 3s ease-in-out infinite; }

        @keyframes css-slow-rotate {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .anim-css-slow-rotate { animation: css-slow-rotate 20s linear infinite; }

        @keyframes css-pendulum {
          0%, 100% { transform: rotate(-3deg); }
          50%      { transform: rotate(3deg); }
        }
        .anim-css-pendulum { animation: css-pendulum 3.6s ease-in-out infinite; }

        @keyframes css-shimmer {
          0%   { -webkit-mask-position: 200% center; mask-position: 200% center; }
          100% { -webkit-mask-position: -200% center; mask-position: -200% center; }
        }
        .anim-css-shimmer {
          -webkit-mask-image: linear-gradient(90deg, #000 25%, transparent 50%, #000 75%);
          mask-image: linear-gradient(90deg, #000 25%, transparent 50%, #000 75%);
          -webkit-mask-size: 200% 100%;
          mask-size: 200% 100%;
          animation: css-shimmer 3s ease-in-out infinite;
        }

        @keyframes css-jello {
          0%, 100% { transform: skewX(0deg) skewY(0deg); }
          20%  { transform: skewX(-4deg) skewY(2deg); }
          40%  { transform: skewX(3deg) skewY(-1.5deg); }
          60%  { transform: skewX(-2deg) skewY(1deg); }
          80%  { transform: skewX(1deg) skewY(-0.5deg); }
        }
        .anim-css-jello { animation: css-jello 2s ease-in-out infinite; }

        @keyframes css-heartbeat {
          0%, 100% { transform: scale(1); }
          14%  { transform: scale(1.08); }
          28%  { transform: scale(1); }
          42%  { transform: scale(1.12); }
          56%  { transform: scale(1); }
        }
        .anim-css-heartbeat { animation: css-heartbeat 1.8s ease-in-out infinite; }

        @keyframes css-glitch-loop {
          0%, 90%, 100% { transform: translate(0) skewX(0); }
          92%  { transform: translate(-3px, 1px) skewX(2deg); }
          94%  { transform: translate(5px, -1px) skewX(-3deg); }
          96%  { transform: translate(-2px, 0) skewX(1deg); }
          98%  { transform: translate(0) skewX(0); }
        }
        .anim-css-glitch-loop { animation: css-glitch-loop 4s linear infinite; }

        @keyframes css-color-shift {
          0%   { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        .anim-css-color-shift { animation: css-color-shift 8s linear infinite; }

        @keyframes css-shadow-dance {
          0%, 100% { filter: drop-shadow(6px 0 12px rgba(192,192,192,0.4)); }
          25%      { filter: drop-shadow(0 6px 12px rgba(192,192,192,0.4)); }
          50%      { filter: drop-shadow(-6px 0 12px rgba(192,192,192,0.4)); }
          75%      { filter: drop-shadow(0 -6px 12px rgba(192,192,192,0.4)); }
        }
        .anim-css-shadow-dance { animation: css-shadow-dance 4s linear infinite; }

        @keyframes css-figure-8 {
          0%, 100% { transform: translate(0, 0); }
          25%  { transform: translate(10px, -6px); }
          50%  { transform: translate(0, 0); }
          75%  { transform: translate(-10px, 6px); }
        }
        .anim-css-figure-8 { animation: css-figure-8 4s ease-in-out infinite; }

        @keyframes css-wave {
          0%, 100% { transform: skewX(-2deg); }
          50%      { transform: skewX(2deg); }
        }
        .anim-css-wave { animation: css-wave 3s ease-in-out infinite; }

        @keyframes css-rubber-band {
          0%, 100% { transform: scale(1, 1); }
          10%  { transform: scale(1.08, 0.94); }
          20%  { transform: scale(0.95, 1.06); }
          30%  { transform: scale(1.04, 0.97); }
          40%  { transform: scale(1, 1); }
        }
        .anim-css-rubber-band { animation: css-rubber-band 2.5s ease-in-out infinite; animation-delay: 2s; }

        @keyframes css-orbit {
          0%   { transform: translate(0, -4px); }
          25%  { transform: translate(6px, 0); }
          50%  { transform: translate(0, 4px); }
          75%  { transform: translate(-6px, 0); }
          100% { transform: translate(0, -4px); }
        }
        .anim-css-orbit { animation: css-orbit 4.5s linear infinite; }

        @keyframes css-flicker {
          0%, 100% { opacity: 1; }
          15%  { opacity: 0.85; }
          30%  { opacity: 1; }
          45%  { opacity: 0.9; }
          60%  { opacity: 1; }
          75%  { opacity: 0.85; }
          90%  { opacity: 1; }
        }
        .anim-css-flicker { animation: css-flicker 2.4s ease-in-out infinite; }

        @keyframes css-morph-pulse {
          0%, 100% { transform: scale(1, 1); }
          25%  { transform: scale(1.06, 0.96); }
          50%  { transform: scale(1, 1); }
          75%  { transform: scale(0.96, 1.06); }
        }
        .anim-css-morph-pulse { animation: css-morph-pulse 4.5s ease-in-out infinite; }

        @keyframes css-tilt-drift {
          0%, 100% { transform: perspective(600px) rotateX(0deg) rotateY(0deg); }
          25%  { transform: perspective(600px) rotateX(8deg) rotateY(-6deg); }
          50%  { transform: perspective(600px) rotateX(0deg) rotateY(0deg); }
          75%  { transform: perspective(600px) rotateX(-8deg) rotateY(6deg); }
        }
        .anim-css-tilt-drift { animation: css-tilt-drift 9s ease-in-out infinite; }

        /* ── HOVER EFFECTS ── */
        .hover-glow-surge {
          transition: filter 0.3s ease;
          filter: drop-shadow(0 0 4px rgba(192,192,192,0.1));
        }
        .hover-glow-surge:hover {
          filter: drop-shadow(0 0 24px rgba(192,192,192,0.7)) drop-shadow(0 0 48px rgba(192,192,192,0.3));
        }

        .hover-scale-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-scale-lift:hover {
          transform: scale(1.05) translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.3);
        }

        .hover-color-invert {
          transition: filter 0.4s ease;
        }
        .hover-color-invert:hover {
          filter: invert(1);
        }

        .hover-shake:hover {
          animation: hover-shake-kf 0.4s ease;
        }
        @keyframes hover-shake-kf {
          0%, 100% { transform: translate(0); }
          10%  { transform: translate(-3px, 1px); }
          20%  { transform: translate(3px, -1px); }
          30%  { transform: translate(-2px, 2px); }
          40%  { transform: translate(2px, -2px); }
          50%  { transform: translate(-1px, 1px); }
          60%  { transform: translate(1px, -1px); }
          70%  { transform: translate(-1px, 0); }
          80%  { transform: translate(1px, 0); }
          90%  { transform: translate(0); }
        }

        .hover-spin-once {
          transition: transform 0.6s ease;
        }
        .hover-spin-once:hover {
          transform: rotate(360deg);
        }

        .hover-blur-sharpen {
          filter: blur(2px);
          transition: filter 0.4s ease;
        }
        .hover-blur-sharpen:hover {
          filter: blur(0px);
        }

        .hover-border-trace {
          position: relative;
          outline: 2px solid transparent;
          outline-offset: 6px;
          transition: outline-color 0.3s ease, outline-offset 0.3s ease;
        }
        .hover-border-trace:hover {
          outline-color: rgba(192,192,192,0.6);
          outline-offset: 4px;
        }

        .hover-neon-flicker:hover {
          animation: hover-neon-kf 0.8s ease infinite;
        }
        @keyframes hover-neon-kf {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(192,192,192,0.6)) drop-shadow(0 0 12px rgba(192,192,192,0.3)); }
          25%  { filter: drop-shadow(0 0 2px rgba(192,192,192,0.2)) drop-shadow(0 0 4px rgba(192,192,192,0.1)); }
          50%  { filter: drop-shadow(0 0 10px rgba(192,192,192,0.8)) drop-shadow(0 0 20px rgba(192,192,192,0.4)); }
          75%  { filter: drop-shadow(0 0 3px rgba(192,192,192,0.3)) drop-shadow(0 0 6px rgba(192,192,192,0.15)); }
        }

        /* tilt-3d and stagger-glow are handled via JS hooks */
        .hover-tilt-3d { transition: transform 0.15s ease-out; }
        .hover-stagger-glow { cursor: pointer; }
      `}</style>
    </main>
  )
}
