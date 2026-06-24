import { makeStillGallery, originalVideo, videoCover, webVideo } from "./assets.js";

const categoryLabels = {
  narrative: "剧情片",
  documentary: "纪录片",
  commercial: "商业宣传片",
  shortform: "短视频",
  automotive: "汽车影像",
  event: "活动快剪",
  experimental: "AI影像",
  expanded: "扩展影像"
};

const videoFiles = [
  ["剧情片《Hunter》.mp4", "narrative", "still-06.jpg", 3, "剧情片《Hunter》"],
  ["剧情片《爸妈》.mp4", "narrative", "still-07.jpg", 3, "剧情片《爸妈》"],
  ["剧情片《借钱》.mp4", "narrative", "still-08.jpg", 4, "剧情片《借钱》"],
  ["剧情片《迷路》.mp4", "narrative", "still-09.jpg", 3, "剧情片《迷路》"],
  ["纪录片《雨花》.mp4", "documentary", "video-05.jpg", 0, "纪录片《雨花》"],
  ["机构宣传片2.mp4", "commercial", "video-04.jpg", 0, "机构宣传片 2"],
  ["台球厅宣传片.mp4", "commercial", "video-19.jpg", 0, "台球厅宣传片"],
  ["艺考机构宣传片.mp4", "commercial", "video-20.jpg", 0, "艺考机构宣传片"],
  ["剧组花絮.mp4", "commercial", "video-06.jpg", 0, "剧组花絮"],
  ["剧组花絮2.mp4", "commercial", "video-07.jpg", 0, "剧组花絮 2"],
  ["抖音博主信息流1.mp4", "shortform", "video-01.jpg", 0, "抖音博主信息流 1"],
  ["抖音博主信息流2.mp4", "shortform", "video-02.jpg", 0, "抖音博主信息流 2"],
  ["台球厅抖音.mp4", "shortform", "video-18.jpg", 0, "台球厅抖音"],
  ["说车.mp4", "shortform", "video-17.jpg", 0, "说车"],
  ["拍车——保时捷.mp4", "automotive", "video-09.jpg", 0, "拍车——保时捷"],
  ["拍车——迈巴赫.mp4", "automotive", "video-10.jpg", 0, "拍车——迈巴赫"],
  ["拍车——迈巴赫2.mp4", "automotive", "video-11.jpg", 0, "拍车——迈巴赫 2"],
  ["拍车——迈凯伦.mp4", "automotive", "video-12.jpg", 0, "拍车——迈凯伦"],
  ["拍车——迈凯伦2.mp4", "automotive", "video-13.jpg", 0, "拍车——迈凯伦 2"],
  ["拍车——迈凯伦3.mp4", "automotive", "video-14.jpg", 0, "拍车——迈凯伦 3"],
  ["拍车——迈凯伦4.mp4", "automotive", "video-15.jpg", 0, "拍车——迈凯伦 4"],
  ["拍车——迈凯伦5.mp4", "automotive", "video-16.jpg", 0, "拍车——迈凯伦 5"],
  ["快剪——毕业红毯.mov", "event", "still-10.jpg", 4, "快剪——毕业红毯"],
  ["快剪——苏州gt秀.mp4", "event", "video-08.jpg", 0, "快剪——苏州 GT 秀"],
  ["快剪——跳海酒吧.mov", "event", "still-11.jpg", 3, "快剪——跳海酒吧"],
  ["AI视频——剧情片《山火》.mp4", "experimental", "still-01.jpg", 3, "AI视频——剧情片《山火》"],
  ["AI视频——时装tvc.mp4", "experimental", "still-03.jpg", 3, "AI视频——时装 TVC"],
  ["AI视频——时装tvc2.mp4", "experimental", "still-02.jpg", 3, "AI视频——时装 TVC 2"],
  ["采访作品——《小巷六分钟》.mp4", "documentary", "still-04.jpg", 3, "采访作品——《小巷六分钟》"],
  ["歌舞片《寻人启事》.mp4", "expanded", "still-05.jpg", 4, "歌舞片《寻人启事》"],
  ["航拍《凛冬将至》.mov", "expanded", "video-03.jpg", 0, "航拍《凛冬将至》"]
];

export const videoCategories = [
  { id: "all", label: "全部影像", labelZh: "Video Works" },
  ...Object.entries(categoryLabels).map(([id, label]) => ({ id, label, labelZh: label }))
];

export const videoWorks = videoFiles.map(([file, category, cover, stillCount, title], index) => ({
  id: `video-${index + 1}`,
  fileName: file,
  type: "视频作品",
  title,
  category,
  categoryLabel: categoryLabels[category],
  year: "2023-2026",
  medium: file.endsWith(".mov") ? "MOV Video" : "MP4 Video",
  src: webVideo(index + 1),
  originalSrc: originalVideo(file),
  webSrc: webVideo(index + 1),
  cover: videoCover(cover),
  gallery: stillCount > 0 ? makeStillGallery(file.replace(/\.[^.]+$/, ""), stillCount) : [],
  description: "影像档案项目，包含拍摄、剪辑与视觉叙事实践。"
}));
