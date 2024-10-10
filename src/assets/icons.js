export const DeleteIcon = (pathId) => {
    return `
    <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
      <g>
        <g>
            <mask id="path-${pathId}" fill="white">
            <rect x="4.5" y="6" width="12" height="11" rx="1"/>
            </mask>
            <rect x="4.5" y="6" width="12" height="11" rx="1" stroke="#C7482D" stroke-width="3" mask="url(#path-${pathId})"/>
        </g>
        <path id="Vector 32" d="M4.5 4L16.5 4" stroke="#C7482D" stroke-width="1.5" stroke-linecap="round"/>
        <path id="Vector 33" d="M8.5 3L12.5 3" stroke="#C7482D" stroke-width="1.5" stroke-linecap="round"/>
      </g>
    </svg>      
  `;
};

export const ImageIcon = (pathId) => {
    return `
    <svg width="52" height="53" viewBox="0 0 52 53" fill="none">
        <mask id="path-${pathId}" fill="white">
            <rect x="5.19995" y="8.30005" width="41.6" height="36.4" rx="2"/>
        </mask>
        <rect x="5.19995" y="8.30005" width="41.6" height="36.4" rx="2" stroke="#E6DAD3" stroke-width="8" mask="url(#path-${pathId})"/>
        <path d="M7.80005 39.5L21.0803 24.8846C21.2811 24.6637 21.6263 24.6568 21.8357 24.8695L25.607 28.7007C25.8192 28.9162 26.1698 28.9059 26.369 28.6783L34.7311 19.1216C34.9303 18.894 35.2809 18.8837 35.4931 19.0992L44.2001 27.9444" stroke="#E6DAD3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`;
};
