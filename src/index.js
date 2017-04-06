function isBrowserState(key) {
  switch (key) {
  case ':hover':
  case ':active':
  case ':visited':
  case ':focus':
  case ':disabled':
    return true;
  default:
    return false;
  }
}

export default function browserStatePlugin({
  addCSS,
  appendImportantToEachValue,
  config,
  cssRuleSetToString,
  hash,
  props,
  style,
}) {
  let className = props.className;
  const newStyle = Object.entries(style).reduce((newStyleInProgress, [key, value]) => {
    if (isBrowserState(key)) {
      const ruleCSS = cssRuleSetToString('', appendImportantToEachValue(value), config.userAgent);
      const hoverClassName = `susu-rad-${hash(ruleCSS)}`;
      const css = `.${hoverClassName}${key}${ruleCSS}`;
      addCSS(css);
      if (!className) {
        className = hoverClassName;
      } else {
        className += ` ${hoverClassName}`;
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
