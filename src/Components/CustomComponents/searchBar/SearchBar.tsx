// components/SearchBarComponent.tsx

"use client";

import { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { VscLoading } from "react-icons/vsc";
import { GoGear } from "react-icons/go";
import { HandleSearchAPI } from "@/utils/api/SearchAPI/SearchAPI";
import { MdAttachFile } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import { IoListOutline } from "react-icons/io5";
import { BsChat } from "react-icons/bs";
import { FiLink } from "react-icons/fi";
import { RiShareBoxFill } from "react-icons/ri";
import { FaFolder } from "react-icons/fa6";

import "./styles.css";
import Button from "@/Components/UI/Button/Button";
import ToggleButton from "@/Components/UI/ToggleButton/ToggleButton";

// Define the type for the API response object, matching the one in your api.ts
interface ApiWordResponse {
  word: string;
  score: number;
}
interface templateStorage {
  word: string;
  score: number;
  type: CategoryType;
}
type CategoryType = "total" | "chats" | "files" | "people" | "list";

const SearchBarComponent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<templateStorage[]>([]);
  const [chats, setChats] = useState<templateStorage[]>([]);
  const [files, setFiles] = useState<templateStorage[]>([]);
  const [people, setPeople] = useState<templateStorage[]>([]);
  const [list, setList] = useState<templateStorage[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType>("total");
  const [activeTabs, setActiveTabs] = useState<CategoryType[]>([
    "total",
    "files",
    "people",
  ]);
  const [dataToRender, setDataToRender] = useState<templateStorage[]>([]);
  const [gearSuboptionOpen, setGearSuboptionOpen] = useState<boolean>(false);
  // Debouncing logic with useEffect
  useEffect(() => {
    if (query.length <= 2) {
      // This is now true (0 <= 2)
      setIsLoading(false);
      // Clear all result states
      setResults([]);
      setChats([]);
      setFiles([]);
      setPeople([]);
      setList([]);
      return; // The effect stops here. No new timer is created.
    }

    // This part only runs if the query is long enough.
    setIsLoading(true);

    const timer = setTimeout(() => {
      HandleSearchAPI(query).then((data: ApiWordResponse[]) => {
        handleDataConversion(data);
        setIsLoading(false);
      });
    }, 700);

    // This cleanup function will be called the *next* time the query changes.
    return () => {
      clearTimeout(timer);
    };
  }, [query]);
  // This effect re-runs whenever the 'query' state changes

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  // function to divide data into section like total, chats , files , people, list
  const handleDataConversion = (data: ApiWordResponse[]) => {
    const totalLength = data.length;

    // Initialize the categorized arrays
    let total: templateStorage[] = [];
    let chats: templateStorage[] = [];
    let files: templateStorage[] = [];
    let people: templateStorage[] = [];
    let list: templateStorage[] = [];

    // Rule 1: 'total' always contains all elements
    total = data.map((item) => ({ ...item, type: "total" }));

    // --- Apply categorization rules ---

    if (totalLength < 9) {
      // Case 1: Less than 9 elements
      // All data goes into 'people' and 'files'
      people = data.map((item) => ({ ...item, type: "people" }));
      files = data.map((item) => ({ ...item, type: "files" }));
    } else if (totalLength > 24) {
      // Case 2: More than 24 elements
      // Distribute 6 items to each category
      const sliceSize = 6;
      chats = data
        .slice(0, sliceSize)
        .map((item) => ({ ...item, type: "chats" }));
      files = data
        .slice(sliceSize, sliceSize * 2)
        .map((item) => ({ ...item, type: "files" }));
      people = data
        .slice(sliceSize * 2, sliceSize * 3)
        .map((item) => ({ ...item, type: "people" }));
      list = data
        .slice(sliceSize * 3, sliceSize * 4)
        .map((item) => ({ ...item, type: "list" }));
    } else {
      // Case 3: Between 9 and 24 elements (inclusive)
      // Distribute based on 3:2:1 ratio for people:chats:files
      const totalRatioParts = 6; // 3 + 2 + 1
      const unit = totalLength / totalRatioParts;

      const filesCount = Math.floor(unit * 1);
      const chatsCount = Math.floor(unit * 2);
      // The rest goes to 'people' to ensure all items are allocated, avoiding loss from Math.floor
      const peopleCount = totalLength - filesCount - chatsCount;

      let currentIndex = 0;

      // Slice for 'files' (1x)
      files = data
        .slice(currentIndex, currentIndex + filesCount)
        .map((item) => ({ ...item, type: "files" }));
      currentIndex += filesCount;

      // Slice for 'chats' (2x)
      chats = data
        .slice(currentIndex, currentIndex + chatsCount)
        .map((item) => ({ ...item, type: "chats" }));
      currentIndex += chatsCount;

      // Slice for 'people' (3x - the remainder)
      people = data
        .slice(currentIndex, currentIndex + peopleCount)
        .map((item) => ({ ...item, type: "people" }));
    }
    //   updating state
    setResults([...chats, ...files, ...people, ...list]);
    setChats(chats);
    setFiles(files);
    setPeople(people);
    setList(list);
    setDataToRender(total); // Default to 'total' category
  };
  const hanldeClearQuery = () => {
    setQuery("");
    setResults([]);
    setChats([]);
    setFiles([]);
    setPeople([]);
    setList([]);
    setDataToRender([]);
  };
  const handleActiveDataToRender = (type: CategoryType) => {
    switch (type) {
      case "total":
        setDataToRender(results);
        setActiveCategory("total");
        break;
      case "chats":
        setDataToRender(chats);
        setActiveCategory("chats");
        break;
      case "files":
        setDataToRender(files);
        setActiveCategory("files");
        break;
      case "people":
        setDataToRender(people);
        setActiveCategory("people");
        break;
      case "list":
        setDataToRender(list);
        setActiveCategory("list");
        break;
      default:
        setDataToRender(results);
        setActiveCategory("total");
    }
  };
  const toggleOpenGearSuboption = () => {
    setGearSuboptionOpen(!gearSuboptionOpen);
  };
  // logic to check if the current tab is active or not
  const isTabActive = (type: CategoryType): boolean => {
    return activeTabs.includes(type);
  };
  // logic to handle click on tab
  const handleTabClick = (type: CategoryType) => {
    if (isTabActive(type)) {
      // remove from active tabs
      const updatedTabs = activeTabs.filter((tab) => tab !== type);
      setActiveTabs(updatedTabs);
      // if the active category is the one being removed, switch to 'total'
      if (activeCategory === type) {
        handleActiveDataToRender("total");
      }
    } else {
      // add to active tabs
      const updatedTabs = [...activeTabs, type];
      setActiveTabs(updatedTabs);
    }
  };

  return (
    <div
      className={`h-auto transition bg-white min-h-[50px] rounded-lg flex flex-col shadow-md w-1/2`}
    >
      <div className="w-full h-50px flex items-center px-3 min-h-[50px]">
        <div className="w-[30px] text-[#000]">
          {isLoading ? (
            <VscLoading className="animate-spin" />
          ) : (
            <IoSearchOutline />
          )}
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            className="bg-transparent text-[#737373] outline-none border-none w-full h-full placeholder-[#737373]"
            placeholder="Enter text to search..."
          />
        </div>
        <div>
          <Button
            label="Clear"
            styles={{ color: "#000" }}
            variant="underline"
            clickFn={hanldeClearQuery}
          />
        </div>
      </div>

      <div
        className={`${
          results.length > 0 || isLoading ? "dataFill" : "dataBlank"
        }  transition  w-full bg-white rounded-lg shadow-lg  overflow-y-auto z-10 no-scrollbar `}
      >
        <div className="h-[50px] border-b border-gray-200 flex items-center px-4 justify-between sticky top-0 bg-white z-20">
          <div className="flex space-x-2 h-full gap-4">
            {/* The "All" button is always visible */}
            <Button
              isActive={activeCategory === "total"}
              clickFn={() => handleActiveDataToRender("total")}
              label={"All"}
              variant="default"
              count={results.length}
            />

            {/* --- Conditionally Rendered Buttons --- */}
            {/* Show File button only if 'files' is in activeTabs */}
            {isTabActive("files") && (
              <Button
                isActive={activeCategory === "files"}
                icon={<MdAttachFile />}
                clickFn={() => handleActiveDataToRender("files")}
                label={"File"}
                variant="default"
                count={files.length}
              />
            )}

            {/* Show People button only if 'people' is in activeTabs */}
            {isTabActive("people") && (
              <Button
                isActive={activeCategory === "people"}
                icon={<FaRegUser />}
                clickFn={() => handleActiveDataToRender("people")}
                label={"People"}
                variant="default"
                count={people.length}
              />
            )}

             {/* Show Chat button only if 'chats' is in activeTabs */}
            {isTabActive("chats") && (
              <Button
                isActive={activeCategory === "chats"}
                icon={<BsChat />}
                clickFn={() => handleActiveDataToRender("chats")}
                label={"Chat"}
                variant="default"
                count={chats.length}
              />
            )}

            {/* Show List button only if 'list' is in activeTabs */}
            {isTabActive("list") && (
              <Button
                isActive={activeCategory === "list"}
                icon={<IoListOutline />}
                clickFn={() => handleActiveDataToRender("list")}
                label={"List"}
                variant="default"
                count={list.length}
              />
            )}
          </div>

          <div className="w-[30px] h-full text-[20px] flex items-center justify-center relative">
            <GoGear
              onClick={toggleOpenGearSuboption}
              className={`gear-icon ${
                gearSuboptionOpen && "gear-icon-open"
              } text-gray-600 hover:text-gray-800 cursor-pointer`}
            />
            <div
              className={`${
                gearSuboptionOpen ? "openGearBox" : "closeGearBox"
              } absolute top-full right-0 rounded bg-white border border-gray-200 shadow-lg w-40 p-2 z-30`}
            >
              <ul>
                <li
                  onClick={() => {
                    handleTabClick("files");
                  }}
                  className={`${
                    isTabActive("files") ? "text-[#000]" : "text-[#737373]"
                  } text-[16px] cursor-pointer flex justify-between items-center `}
                >
                  File <ToggleButton currentState={isTabActive("files")} />{" "}
                </li>
                <li
                  onClick={() => {
                    handleTabClick("people");
                  }}
                  className={`${
                    isTabActive("people") ? "text-[#000]" : "text-[#737373]"
                  } text-[16px] cursor-pointer flex justify-between items-center `}
                >
                  People <ToggleButton currentState={isTabActive("people")} />
                </li>
                <li
                  onClick={() => {
                    handleTabClick("chats");
                  }}
                  className={`${
                    isTabActive("chats") ? "text-[#000]" : "text-[#737373]"
                  } text-[16px] cursor-pointer flex justify-between items-center `}
                >
                  Chat <ToggleButton currentState={isTabActive("chats")} />
                </li>
                <li
                  onClick={() => {
                    handleTabClick("list");
                  }}
                  className={`${
                    isTabActive("list") ? "text-[#000]" : "text-[#737373]"
                  } text-[16px] cursor-pointer flex justify-between items-center `}
                >
                  List <ToggleButton currentState={isTabActive("list")} />
                </li>
              </ul>
            </div>
          </div>
        </div>
        {!isLoading && (
          <ul>
            {dataToRender.map((result, index) => (
              <li
                key={`${result.word}-${index}`}
                className="group p-4 flex items-center justify-between hover:bg-gray-100 cursor-pointer text-gray-800 h-10"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#737373] w-6 h-6 rounded flex items-center justify-center">
                    {result.type === "files" ? (
                      <FaFolder className="text-white m-[6px]" />
                    ) : result.type === "people" ? (
                      <FaRegUser className="text-white m-[6px]" />
                    ) : result.type === "chats" ? (
                      <BsChat className="text-white m-[6px]" />
                    ) : result.type === "list" ? (
                      <IoListOutline className="text-white m-[6px]" />
                    ) : (
                      <IoSearchOutline className="text-white m-[6px]" />
                    )}
                  </div>
                  {result.word}
                </div>

                <div className="transition opacity-0 group-hover:opacity-100 flex items-center gap-4">
                  <div className="text-black bg-[#737373] rounded-full w-6 h-6 flex items-center justify-center text-[12px]">
                    <FiLink />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <RiShareBoxFill /> New Tab
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {isLoading && (
          <ul className="pointer-events-none py-4">
            <li className="h-10 flex px-2 gap-4">
              <div className="w-8 h-8 bg-[#E0E0E0] rounded"></div>
              <div className="flex-1 flex flex-col gap-2 ">
                <div className="w-1/4 h-[10px] rounded bg-[#E0E0E0]"></div>
                <div className="w-full h-[10px] rounded bg-[#E0E0E0]"></div>
              </div>
            </li>
            <li className="h-10 flex px-2 gap-4">
              <div className="w-8 h-8 bg-[#E0E0E0] rounded"></div>
              <div className="flex-1 flex flex-col gap-2 ">
                <div className="w-1/4 h-[10px] rounded bg-[#E0E0E0]"></div>
                <div className="w-full h-[10px] rounded bg-[#E0E0E0]"></div>
              </div>
            </li>
            <li className="h-10 flex px-2 gap-4">
              <div className="w-8 h-8 bg-[#E0E0E0] rounded"></div>
              <div className="flex-1 flex flex-col gap-2 ">
                <div className="w-1/4 h-[10px] rounded bg-[#E0E0E0]"></div>
                <div className="w-full h-[10px] rounded bg-[#E0E0E0]"></div>
              </div>
            </li>
            <li className="h-10 flex px-2 gap-4">
              <div className="w-8 h-8 bg-[#E0E0E0] rounded"></div>
              <div className="flex-1 flex flex-col gap-2 ">
                <div className="w-1/4 h-[10px] rounded bg-[#E0E0E0]"></div>
                <div className="w-full h-[10px] rounded bg-[#E0E0E0]"></div>
              </div>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBarComponent;
