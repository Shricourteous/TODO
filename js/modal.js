/**
 * Modal Module
 * Centralized modal management
 */

const Modal = (() => {
  const show = (contentEl, isImageModal = false) => {
    const root = Utils.qs('#modal-root');
    root.innerHTML = '';
    
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4';
    overlay.style.cssText = 'background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);';
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        root.innerHTML = '';
      }
    });
    
    const box = document.createElement('div');
    if (isImageModal) {
      box.className = 'relative max-w-7xl max-h-[95vh] w-full';
    } else {
      box.className = 'w-full max-w-lg max-h-[90vh] overflow-auto rounded-xl shadow-2xl';
      box.style.cssText = 'background-color: var(--bg-secondary);';
    }
    
    box.appendChild(contentEl);
    overlay.appendChild(box);
    root.appendChild(overlay);
  };

  const close = () => {
    Utils.qs('#modal-root').innerHTML = '';
  };

  const showImage = (src, alt='') => {
    const container = document.createElement('div');
    container.className = 'relative rounded-xl overflow-hidden flex items-center justify-center';
    container.style.cssText = 'background-color: rgba(0, 0, 0, 0.95);';
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm';
    closeBtn.innerHTML = `
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    `;
    closeBtn.onclick = close;
    container.appendChild(closeBtn);
    
    // Download button
    const downloadBtn = document.createElement('a');
    downloadBtn.href = src;
    downloadBtn.download = alt || 'image';
    downloadBtn.className = 'absolute top-4 right-16 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm';
    downloadBtn.innerHTML = `
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
      </svg>
    `;
    container.appendChild(downloadBtn);
    
    // Image
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.className = 'max-w-full max-h-[95vh] w-auto h-auto object-contain rounded-lg';
    img.style.cssText = 'box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);';
    container.appendChild(img);
    
    show(container, true);
  };

  return { show, close, showImage };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Modal;
}
