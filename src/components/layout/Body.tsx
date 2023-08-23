import React from "react";

/**
 *
 * @param props
 * @returns content for the body
 */
interface ParentCompProps {
  content?: React.ReactNode;
}
const Body: React.FC<ParentCompProps> = (props) => {
  const { content } = props;
  return (
    <div
      className="uda-container uda-clear uda-cards-scroller uda_exclude"
      id="uda-content-container"
    >
      {content}
    </div>
  );
};

export default Body;
