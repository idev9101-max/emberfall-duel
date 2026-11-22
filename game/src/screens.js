export function showScreen(name) {
  document.querySelectorAll('.screen').forEach((el) => el.classList.remove('active'));
  const id = name === 'title' ? 'screen-title'
    : name === 'table' ? 'screen-table'
    : name === 'win' ? 'screen-win'
    : name === 'loss' ? 'screen-loss'
    : null;
  if (id) document.getElementById(id)?.classList.add('active');
}
