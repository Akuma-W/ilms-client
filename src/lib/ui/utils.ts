export function getGradientFromTitle(title: string) {
  const colors = [
    'from-blue-500 to-indigo-500',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-cyan-500 to-blue-500',
  ];

  const index = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}

export function getColorFromTitle(title: string) {
  const colors = ['#3B82F6', '#A855F7', '#10B981', '#F97316', '#06B6D4'];

  const index = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}
