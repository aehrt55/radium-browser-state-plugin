function isPseudoSelector(key) {
  switch (key) {
  case 'hover':
  case 'active':
  case 'visited':
  case 'focus':
  case 'disabled':
  case 'after':
  case 'before':
    return true;
  default:
    return false;
  }
}

function isPseudoSelectors(key) {
  return ((key[0] === ':') && key
  .split(':').splice(1).reduce((result, _key) => (result && isPseudoSelector(_key)), true));
}

export default function pseudoSelectorPlugin({
  addCSS,
  appendImportantToEachValue,
  config,
  cssRuleSetToString,
  hash,
  props,
  style,
}) {
  let { className } = props;
  const newStyle = Object.entries(style).reduce((newStyleInProgress, [key, value]) => {
    if (isPseudoSelectors(key)) {
      const ruleCSS = cssRuleSetToString('', appendImportantToEachValue(value), config.userAgent);
      const pseudoSelectorClassName = `susu-pseudo-${hash(ruleCSS)}`;
      const css = `.${pseudoSelectorClassName}${key}${ruleCSS}`;
      addCSS(css);
      if (!className) {
        className = pseudoSelectorClassName;
      } else {
        className += ` ${pseudoSelectorClassName}`;
      }
    } else {
      newStyleInProgress[key] = value;
    }
    return newStyleInProgress;
  }, {});
  return {
    props: className === props.className ? null : { className },
    style: newStyle,
  };
}
