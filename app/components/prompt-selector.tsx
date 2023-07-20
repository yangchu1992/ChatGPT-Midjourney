import styles from "./prompt-selector.module.scss";
import {PromptWords, usePromptWordsStore} from "../store/prompt-words";
import {Chat } from './chat'
import {useState} from "react";

export function PromptSelector(props: { className?: string })
{
  // prompt hints
  const [showDir, setShowDir] = useState("");

  const promptWordsStore = usePromptWordsStore.getState();

  promptWordsStore.fetch()

  console.log("提示词", promptWordsStore.getUserPromptWords())
  const [active, setActive] = useState(promptWordsStore.getSubType()[0] || "");
  return (
    <div
      className={`${styles.prompt} ${props.className}`}
    >
      <div className={styles["prompt-header"]}>
         <div className={styles["prompt-title"]}>提示词词典</div>
      </div>
      <div className={styles["prompt-body"]}>
        <div className="dir-buttons">
          {promptWordsStore.getSubType().map((dir) => (
              <button
                  key={dir}
                  className={active === dir ? 'active' : ''}
                  onClick={() => {
                    console.log("这里要替换dir", dir)
                    setActive(dir);
                  }}
              >
                {dir}
              </button>
          ))}
        </div>

        <div className="active-dir">

            {Object.entries(promptWordsStore.PromptWords[active] ?? {}).map(
              ([subDir, words]) => (
                <details className="sub-dir">
                  <summary>
                    <span className="title">{subDir}</span>
                    <span className="len">{words.length}</span>
                  </summary>
                  <div className="list">
                    {words.map((word) => (
                      <div key={word.id} onClick={() => {
                        console.log("选中", word.text)

                      }}>
                        {word.text}
                      </div>
                    ))}
                  </div>
                </details>
              )
            )}
        </div>


      </div>
    </div>
  );
}
