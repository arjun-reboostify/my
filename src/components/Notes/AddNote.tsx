import { FC, useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import createNote from "../../firebase/dbhelpers/createNote";

const AddNote: FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showEditor, setShowEditor] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const editorContainerRef = useRef<any>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!editorContainerRef?.current.contains(event.target)) {
        if (!showEditor) return;
        setShowEditor(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [showEditor, editorContainerRef]);

  // Custom styles for ReactQuill
  const quillStyles = {
    backgroundColor: 'black',
    color: 'white',
    minHeight: '4ch',
  };

  return (
    <div
      ref={editorContainerRef}
      style={{
        boxShadow: "0 3px 3px 0 darkgrey",
      }}
      onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        setShowEditor(true);
      }}
      className="add-note mt-28 border-2 text-left flex flex-col items-stretch mx-auto border-gray-200 rounded-md py-3 bg-black w-full max-w-xl shadow-lg"
    >
      <input
        ref={titleRef}
        onKeyUp={(e) => {
          if (e.code === "Enter") contentRef.current?.focus();
        }}
        className="font-semibold text-base mb-2.5 outline-none px-4 bg-black text-white placeholder-gray-500 focus:placeholder-gray-400 border border-gray-800 focus:border-gray-700 rounded-md transition-colors duration-200"
        value={title}
        placeholder={showEditor ? "Title" : "Make a note..."}
        onChange={(e) => setTitle(e.target.value)}
      />
      {showEditor && (
        <div className="text-white">
          <ReactQuill
            style={quillStyles}
            className="w-full [&_.ql-editor.ql-blank::before]:text-gray-500 [&_.ql-editor]:text-white [&_.ql-toolbar]:border-gray-800 [&_.ql-container]:border-gray-800"
            value={content}
            placeholder="Write your thoughts .. (topics , elaboration , conclusions)"
            onChange={setContent}
            theme="snow"
          />
        </div>
      )}
      <div className="flex flex-row justify-end px-4 mt-4">
        <input
          disabled={title.trim() === "" || content.trim() === ""}
          onClick={(e) => {
            let trimmedTitle = title.trim(),
              trimmedContent = content.trim();
            if (trimmedTitle !== "" && trimmedContent !== "") {
              createNote({
                title: trimmedTitle,
                content: trimmedContent,
              });
              setTitle("");
              setContent("");
            }
          }}
          className="max-w-min cursor-pointer text-white bg-blue-500 disabled:opacity-50 float-right px-3 py-1 rounded"
          type="submit"
          value="Create"
        />
      </div>
    </div>
  );
};

export default AddNote;