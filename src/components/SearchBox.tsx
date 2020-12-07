import React, { useState, useCallback, useEffect } from "react";

export default function SearchBox(props: {
  suggestions: Array<string>;
  onSearchTextChange: Function;
}) {
  const [filtered, setFiltered] = useState<Array<string>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    props.onSearchTextChange(userInput);
  }, [userInput, props]);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.currentTarget.value;
      const filteredSuggestions = props.suggestions.filter((suggestion) => {
        return suggestion.toLowerCase().indexOf(input.toLowerCase()) > -1;
      });
      setFiltered(filteredSuggestions);
      setShowSuggestions(true);
      setUserInput(input);
    },
    [props]
  );

  const onSuggestionClick = useCallback(
    (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      const name = e.currentTarget.innerText;
      setShowSuggestions(false);
      setUserInput(name);
    },
    []
  );

  let suggestionsListComponent;
  if (showSuggestions && userInput && filtered.length) {
    suggestionsListComponent = (
      <ul className="suggestions">
        {filtered.map((suggestion, idx) => {
          return (
            <li key={suggestion} onClick={onSuggestionClick}>
              {suggestion}
            </li>
          );
        })}
      </ul>
    );
  }
  return (
    <React.Fragment>
      <input
        type="text"
        value={userInput}
        className="name-input"
        placeholder="Name"
        onChange={onInputChange}
      />
      {suggestionsListComponent}
    </React.Fragment>
  );
}
