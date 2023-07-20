import {create} from "zustand";
import {persist} from "zustand/middleware";
import {StoreKey} from "../constant";
import {getHeaders} from "@/app/client/api";

export interface PromptWords {
  id?: number;
  text?: string;
  dir?: string;
  desc?: string;
  lang_zh?: string;
  subType?: string;
}

export interface PromptWordsStore {
  counter: number;
  latestId: number;
  active: string;
  PromptWords: Record<string, Record<string, PromptWords[]>>;
  getSubType: () => string[];
  getUserPromptWords: () => PromptWords[];
  fetch: () => void;
}

let fetchState = 0; // 0 not fetch, 1 fetching, 2 done

export const usePromptWordsStore = create<PromptWordsStore>()(
  persist(
    (set, get) => ({
      counter: 0,
      latestId: 0,
      PromptWords: {},
      subTypes: Array<string>(),
      active: '',

      getUserPromptWords() {
        console.log("getUserPromptKeys", get().PromptWords)
        // const userPromptKeys = Object.values(get().PromptWords ?? {});
        // userPromptKeys.sort((a, b) => (b.id && a.id ? b.id - a.id : 0));
        return null;
      },
      getSubType() {
        return get().subTypes;
      },
      fetch() {
        if (fetchState > 0) return;
        fetchState = 1;
        fetch("/api/midjourney/mj/notion/list", {
          method: "get",
          body: null,
          headers: {
            ...getHeaders()
          },
        })
          .then((res) => res.json())
          .then((res: Array<PromptWords>) => {
            let promptWords: Record<string, Record<string, PromptWords[]>> = {}; // 创建一个新的对象
            console.log("[Notion] got notion from server");
            for (let ele of res) {
              if (!promptWords[ele.subType]) {
                promptWords[ele.subType] = {};
              }
              if (!promptWords[ele.subType][ele.dir]) {
                promptWords[ele.subType][ele.dir] = [];
              }
              promptWords[ele.subType][ele.dir].push(ele);
            }
            console.log("===>", promptWords);
            let subTypes = Array.from(new Set(res.map((item) => item.subType)));
            set(() => ({
              PromptWords: promptWords, // 更新 PromptSelector 对象
              subTypes: subTypes, // 更新 subTypes 数组
              active: subTypes[0] ?? ''
            }));
          })
          .catch(() => {
            console.error("[Notion] failed to fetch notion");
          })
          .finally(() => {
            fetchState = 2;
          });
      },
    }),
    {
      name: StoreKey.PromptWords,
      version: 1,
    },
  ),
);
