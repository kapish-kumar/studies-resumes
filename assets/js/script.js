// Simple script to toggle dropdowns in sidebar
document.querySelectorAll('.sidebar > ul > li').forEach(item => {
  const sublist = item.querySelector('ul');
  if (sublist) {
    item.style.cursor = 'pointer';
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      sublist.style.display = sublist.style.display === 'block' ? 'none' : 'block';
    });
  }
});
