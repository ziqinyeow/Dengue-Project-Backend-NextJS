import React, { ChangeEvent, useState } from "react";
import { nanoid } from "nanoid";
// import { storage } from "../lib/firebase/config";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const QuizCard = ({ show, setShow }: any) => {
  const [image, setImage] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [videoURL, setVideoURL] = useState("");
  const [form, setForm] = useState<any>();
  const [uploading, setUploading] = useState(false);
  const [answerScheme, setAnswerScheme] = useState("");

  const change = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value }: any = e.target;
    // @ts-ignore
    setForm({
      ...form,
      [name]: value,
    });
  };

  const submit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const question =
      form?.question +
      "\n\nA " +
      form?.A +
      "\nB " +
      form?.B +
      "\nC " +
      form?.C +
      "\nD " +
      form?.D +
      "\n";

    if (image === null && video === null) {
      return;
    }
    // const id = nanoid();
    // const storageRef = ref(storage, id);
    // if (image) {
    //   uploadBytes(storageRef, image).then(() => {
    //     getDownloadURL(storageRef).then(async (url) => {
    //       setUploading(true);
    //       const fetcher = await fetch("/api/post/create", {
    //         method: "POST",
    //         body: JSON.stringify({
    //           key: process.env.NEXT_PUBLIC_KEY,
    //           post: {
    //             ...form,
    //             url,
    //             type: "image",
    //             like: 0,
    //             view: 0,
    //           },
    //         }),
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       });
    //       if (fetcher.ok) {
    //         setUploading(false);
    //         setImage(null);
    //         setImageURL("");
    //         setVideo(null);
    //         setVideoURL("");
    //         setShow(0);
    //       }
    //     });
    //   });
    // } else if (video) {
    //   uploadBytes(storageRef, video).then(() => {
    //     getDownloadURL(storageRef).then(async (url) => {
    //       setUploading(true);
    //       const fetcher = await fetch("/api/post/create", {
    //         method: "POST",
    //         body: JSON.stringify({
    //           key: process.env.NEXT_PUBLIC_KEY,
    //           post: {
    //             ...form,
    //             url,
    //             type: "video",
    //             like: 0,
    //             view: 0,
    //           },
    //         }),
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       });
    //       if (fetcher.ok) {
    //         setUploading(false);
    //         setImage(null);
    //         setImageURL("");
    //         setVideo(null);
    //         setVideoURL("");
    //         setShow(0);
    //       }
    //     });
    //   });
    // }
  };
  return (
    <div>
      {show !== 0 && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full py-5 bg-gray-200 bg-opacity-50">
          <div className="relative w-full max-w-3xl max-h-full px-10 py-10 mx-auto overflow-y-auto text-black bg-white rounded-lg shadow-2xl no_scrollbar 2xl:max-w-5xl">
            <h3 className="mb-5 font-bold">Create a Quiz</h3>
            <button
              disabled={uploading}
              type="button"
              onClick={() => {
                setImage(null);
                setImageURL("");
                setVideo(null);
                setVideoURL("");
                setShow(0);
              }}
              className="absolute p-1 text-black transition-all duration-300 rounded-md top-2 right-2 hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"
                />
              </svg>
            </button>
            <form onSubmit={submit}>
              <h5 className="mb-2 font-semibold">Question</h5>
              <input
                type="text"
                placeholder="What is the question?"
                className="w-full px-4 py-2 mb-8 bg-white border rounded-md focus:outline-none focus:border-gray-400"
                name="question"
                onChange={change}
                required
                autoComplete="off"
              />

              <div className="flex items-center justify-between">
                <h5 className="mb-2 font-semibold">Media</h5>
                {(video || image) && (
                  <div
                    onClick={() => {
                      setImage(null);
                      setImageURL("");
                      setVideo(null);
                      setVideoURL("");
                    }}
                    className="cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
                    </svg>
                  </div>
                )}
              </div>
              {!video && !image ? (
                <div className="grid w-full grid-cols-2 gap-5">
                  <input
                    type="file"
                    accept="image/*"
                    id="image"
                    onChange={async (e) => {
                      // @ts-ignore
                      let file = await e.target.files[0];
                      let url;
                      try {
                        url = URL.createObjectURL(file);
                        setImageURL(url);
                      } catch (error) {}
                      setImage(file);
                    }}
                    hidden
                  />
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full p-6 mb-5 border rounded-md cursor-pointer"
                  >
                    {!image ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="48"
                        height="48"
                        className="mb-2 text-gray-600"
                      >
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path
                          fill="currentColor"
                          d="M17.409 19c-.776-2.399-2.277-3.885-4.266-5.602A10.954 10.954 0 0 1 20 11V3h1.008c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3H6V1h2v4H4v7c5.22 0 9.662 2.462 11.313 7h2.096zM18 1v4h-8V3h6V1h2zm-1.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
                        />
                      </svg>
                    ) : (
                      <div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="h-10 mb-2" src={imageURL} alt="image" />
                      </div>
                    )}
                    <div>
                      {!image && (
                        <h5 className="text-sm">
                          <span className="font-semibold">Upload</span> image
                        </h5>
                      )}
                    </div>
                    {/* <h5 className="text-sm font-semibold">{image?.name}</h5> */}
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    id="video"
                    onChange={async (e) => {
                      // @ts-ignore
                      let file = await e.target.files[0];
                      let url;
                      try {
                        url = URL.createObjectURL(file);
                        setVideoURL(url);
                      } catch (error) {}
                      setVideo(file);
                    }}
                    hidden
                  />
                  <label
                    htmlFor="video"
                    className="flex flex-col items-center justify-center w-full p-6 mb-5 border rounded-md cursor-pointer"
                  >
                    {!video ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="48"
                        height="48"
                        className="mb-2 text-gray-600"
                      >
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path
                          fill="currentColor"
                          d="M2 3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993zM4 5v14h16V5H4zm6.622 3.415l4.879 3.252a.4.4 0 0 1 0 .666l-4.88 3.252a.4.4 0 0 1-.621-.332V8.747a.4.4 0 0 1 .622-.332z"
                        />
                      </svg>
                    ) : null}
                    <div>
                      {!video && (
                        <h5 className="text-sm">
                          <span className="font-semibold">Upload</span> video
                        </h5>
                      )}
                    </div>
                    {/* <h5 className="text-sm font-semibold">{video?.name}</h5> */}
                  </label>
                </div>
              ) : (
                <div></div>
              )}
              {image && (
                <div className="flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="mb-2 select-none h-80"
                    src={imageURL}
                    alt="image"
                  />
                </div>
              )}
              {video && (
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {/* <img className="h-10 mb-2" src={imageURL} alt="image" /> */}
                  <video
                    src={videoURL}
                    controls
                    className="w-full mb-2 select-none h-80"
                  ></video>
                </div>
              )}

              <h5 className="my-3 font-semibold">Answer</h5>
              <div className="flex items-center mb-2 space-x-5">
                <h5 className="pl-2 font-semibold">A</h5>
                <input
                  type="text"
                  placeholder="True"
                  className="w-full px-4 py-2 placeholder-gray-300 bg-white border rounded-md focus:outline-none focus:border-gray-400"
                  name="A"
                  onChange={change}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="flex items-center mb-2 space-x-5">
                <h5 className="pl-2 font-semibold">B</h5>
                <input
                  type="text"
                  placeholder="False"
                  className="w-full px-4 py-2 placeholder-gray-300 bg-white border rounded-md focus:outline-none focus:border-gray-400"
                  name="B"
                  onChange={change}
                  autoComplete="off"
                />
              </div>
              <div className="flex items-center mb-2 space-x-5">
                <h5 className="pl-2 font-semibold">C</h5>
                <input
                  type="text"
                  placeholder="Prefer not to say"
                  className="w-full px-4 py-2 placeholder-gray-300 bg-white border rounded-md focus:outline-none focus:border-gray-400"
                  name="C"
                  onChange={change}
                  autoComplete="off"
                />
              </div>
              <div className="flex items-center mb-2 space-x-5">
                <h5 className="pl-2 font-semibold">D</h5>
                <input
                  type="text"
                  placeholder="..."
                  className="w-full px-4 py-2 placeholder-gray-300 bg-white border rounded-md focus:outline-none focus:border-gray-400"
                  name="D"
                  onChange={change}
                  autoComplete="off"
                />
              </div>
              <div className="flex items-center justify-end mb-2 space-x-5">
                <h5 className="pl-2 font-semibold">Answer</h5>
                <input
                  type="text"
                  pattern="[ABCDabcd]{1}"
                  placeholder="A"
                  className="w-20 px-4 py-2 placeholder-gray-300 bg-white border rounded-md focus:outline-none focus:border-gray-400"
                  name="answer_scheme"
                  required
                  onChange={(e) => {
                    let { value } = e.target;
                    value = value.replace(/[^ABCDabcd]/gi, "").toUpperCase();
                    setAnswerScheme(value);
                  }}
                  value={answerScheme}
                  autoComplete="off"
                />
              </div>

              <h5 className="mb-2 font-semibold">Explanation</h5>
              <textarea
                placeholder="What is this about?"
                className="w-full px-4 py-2 mb-2 border min-h-[100px] rounded-md focus:outline-none bg-white focus:border-gray-400"
                name="explanation"
                onChange={change}
              />

              <div className="flex justify-end w-full gap-5 mt-8">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 font-medium text-white transition-all duration-150 bg-black border-2 border-black rounded-md disabled:bg-opacity-10 disabled:border-0 disabled:hover:bg-black disabled:hover:bg-opacity-10 disabled:bg-black disabled:text-white disabled:hover:text-white hover:bg-white hover:text-black"
                >
                  Create
                </button>
                <button
                  type="button"
                  disabled={uploading}
                  className="px-5 py-2 font-medium text-red-500 transition-all duration-150 bg-white border-2 border-red-500 rounded-md disabled:bg-opacity-10 disabled:border-0 disabled:hover:bg-black disabled:hover:bg-opacity-10 disabled:bg-black disabled:text-white disabled:hover:text-white hover:bg-red-500 hover:text-white"
                  onClick={() => {
                    setShow(0);
                    setImage(null);
                    setImageURL("");
                    setVideo(null);
                    setVideoURL("");
                  }}
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizCard;
