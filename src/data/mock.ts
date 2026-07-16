import type {
  User, Album, Photo, Comment, Announcement, Message,
  TimelineEvent, Video, DownloadItem,
} from '@/types';

// ========== 图片占位生成 ==========
const IMG = (seed: string, w = 800, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;
const AVATAR = (seed: string) =>
  `https://i.pravatar.cc/150?img=${seed}`;

// ========== 用户数据 ==========
export const mockUsers: User[] = [
  {
    id: 'u1', role: 'admin', studentId: 'DBA2023-001', name: '张明远', avatar: AVATAR('12'),
    company: '远见资本', industry: '金融', position: '董事长',
    researchDirection: '数字化转型与企业价值创造',
    dbaReflection: '在港大北大的学习让我深刻理解了理论与实践的融合，每一次课堂讨论都是思维的碰撞。',
    personalMessage: '学无止境，与智者同行是最大的幸福。',
    phone: '138****8888', phoneVisibility: 'class_only',
    email: 'zhangmy@yuanjian.com', emailVisibility: 'class_only',
    wechat: 'zhangmy_dba', wechatVisibility: 'private',
    enrollmentBatch: '2023级', status: 'active', coverImage: IMG('cover1', 1920, 400),
    personalAlbums: [],
  },
  {
    id: 'u2', role: 'student', studentId: 'DBA2023-002', name: '李慧琳', avatar: AVATAR('5'),
    company: '智云科技集团', industry: '科技', position: 'CEO',
    researchDirection: '人工智能驱动的商业模式创新',
    dbaReflection: '博士旅程不仅是学术探索，更是自我突破的过程。',
    personalMessage: '以科技之力，塑商业之美。',
    phone: '139****6666', phoneVisibility: 'class_only',
    email: 'lihuilin@zhiyun.com', emailVisibility: 'class_only',
    wechat: 'huilin_tech', wechatVisibility: 'private',
    enrollmentBatch: '2023级', status: 'active', coverImage: IMG('cover2', 1920, 400),
    personalAlbums: [],
  },
  {
    id: 'u3', role: 'student', studentId: 'DBA2023-003', name: '王建国', avatar: AVATAR('13'),
    company: '华联制造', industry: '制造', position: '总经理',
    researchDirection: '供应链韧性管理',
    dbaReflection: '理论与实践的结合让我对企业经营有了全新视角。',
    personalMessage: '匠心制造，品质致远。',
    phone: '137****3333', phoneVisibility: 'class_only',
    email: 'wjg@hualian.com', emailVisibility: 'class_only',
    wechat: 'wjg_mfg', wechatVisibility: 'private',
    enrollmentBatch: '2023级', status: 'active', coverImage: IMG('cover3', 1920, 400),
    personalAlbums: [],
  },
  {
    id: 'u4', role: 'student', studentId: 'DBA2023-004', name: '陈雅文', avatar: AVATAR('9'),
    company: '仁济医疗集团', industry: '医疗', position: '副总裁',
    researchDirection: '医疗健康产业的数字化转型',
    dbaReflection: '在DBA的学习中，我找到了医疗管理的学术根基。',
    personalMessage: '仁心济世，管理赋能。',
    phone: '136****7777', phoneVisibility: 'class_only',
    email: 'chenyw@renji.com', emailVisibility: 'class_only',
    wechat: 'yw_chen_med', wechatVisibility: 'private',
    enrollmentBatch: '2023级', status: 'active', coverImage: IMG('cover4', 1920, 400),
    personalAlbums: [],
  },
  {
    id: 'u5', role: 'student', studentId: 'DBA2023-005', name: '刘志强', avatar: AVATAR('15'),
    company: '中能集团', industry: '能源', position: '董事长',
    researchDirection: '新能源企业战略转型',
    dbaReflection: '学术研究为我的企业战略决策提供了坚实支撑。',
    personalMessage: '能源报国，创新未来。',
    phone: '135****2222', phoneVisibility: 'class_only',
    email: 'lzq@zhongneng.com', emailVisibility: 'class_only',
    wechat: 'zq_liu_energy', wechatVisibility: 'private',
    enrollmentBatch: '2023级', status: 'active', coverImage: IMG('cover5', 1920, 400),
    personalAlbums: [],
  },
  {
    id: 'u6', role: 'student', studentId: 'DBA2023-006', name: '赵雪松', avatar: AVATAR('33'),
    company: '启航咨询', industry: '咨询', position: '创始合伙人',
    researchDirection: '组织变革与领导力发展',
    dbaReflection: '港大北大的平台让我接触到最前沿的管理思想。',
    personalMessage: '知行合一，启航未来。',
    phone: '138****5555', phoneVisibility: 'class_only',
    email: 'zhaoxs@qihang.com', emailVisibility: 'class_only',
    wechat: 'xs_zhao_consult', wechatVisibility: 'private',
    enrollmentBatch: '2023级', status: 'active', coverImage: IMG('cover6', 1920, 400),
    personalAlbums: [],
  },
  {
    id: 'u7', role: 'student', studentId: 'DBA2023-007', name: '孙丽华', avatar: AVATAR('20'),
    company: '锦绣文化', industry: '教育', position: '总裁',
    researchDirection: '文化产业的国际化路径',
    dbaReflection: '博士学习重塑了我对文化产业的理解。',
    personalMessage: '文化育人，锦绣前程。',
    phone: '139****1111', phoneVisibility: 'class_only',
    email: 'sunlh@jinxiu.com', emailVisibility: 'class_only',
    wechat: 'lh_sun_edu', wechatVisibility: 'private',
    enrollmentBatch: '2023级', status: 'active', coverImage: IMG('cover7', 1920, 400),
    personalAlbums: [],
  },
  {
    id: 'u8', role: 'student', studentId: 'DBA2023-008', name: '周天宇', avatar: AVATAR('60'),
    company: '天衡律所', industry: '法律', position: '高级合伙人',
    researchDirection: '企业合规治理与法律风险管理',
    dbaReflection: '学术训练让我以更系统的视角审视法律实务。',
    personalMessage: '以法为衡，正义天宇。',
    phone: '137****9999', phoneVisibility: 'class_only',
    email: 'zhouty@tianheng.com', emailVisibility: 'class_only',
    wechat: 'ty_zhou_law', wechatVisibility: 'private',
    enrollmentBatch: '2023级', status: 'active', coverImage: IMG('cover8', 1920, 400),
    personalAlbums: [],
  },
];

// 为每个用户填充个人相册
mockUsers.forEach((u) => {
  u.personalAlbums = [
    {
      id: `pa-${u.id}-1`, type: 'class_group', name: '班级集体合影',
      photos: Array.from({ length: 4 }, (_, i) => ({
        id: `p-${u.id}-1-${i}`, albumId: `pa-${u.id}-1`, uploaderId: u.id, uploaderName: u.name,
        url: IMG(`group${u.id}${i}`, 1200, 800), thumbnail: IMG(`group${u.id}${i}`, 400, 300),
        caption: ['开学典礼合影', '研学集体照', '毕业典礼合影', '班级聚餐'][i] || '',
        visibility: 'public' as const, takenAt: '2023-09-15', uploadAt: '2023-09-16',
        width: 1200, height: 800, viewCount: 120 + i * 15, likeCount: 30 + i * 5, commentCount: i * 2,
      })),
    },
    {
      id: `pa-${u.id}-2`, type: 'personal_research', name: '个人研学抓拍',
      photos: Array.from({ length: 3 }, (_, i) => ({
        id: `p-${u.id}-2-${i}`, albumId: `pa-${u.id}-2`, uploaderId: u.id, uploaderName: u.name,
        url: IMG(`research${u.id}${i}`, 1200, 900), thumbnail: IMG(`research${u.id}${i}`, 400, 300),
        caption: ['华为参访', '上海调研', '新加坡游学'][i] || '',
        visibility: 'class_only' as const, takenAt: '2024-03-20', uploadAt: '2024-03-22',
        width: 1200, height: 900, viewCount: 80 + i * 10, likeCount: 20 + i * 3, commentCount: i,
      })),
    },
    {
      id: `pa-${u.id}-3`, type: 'course', name: '课程课堂照片',
      photos: Array.from({ length: 3 }, (_, i) => ({
        id: `p-${u.id}-3-${i}`, albumId: `pa-${u.id}-3`, uploaderId: u.id, uploaderName: u.name,
        url: IMG(`course${u.id}${i}`, 1200, 800), thumbnail: IMG(`course${u.id}${i}`, 400, 300),
        caption: ['课堂讨论', '小组汇报', '师生交流'][i] || '',
        visibility: 'class_only' as const, takenAt: '2023-11-10', uploadAt: '2023-11-12',
        width: 1200, height: 800, viewCount: 60 + i * 8, likeCount: 15 + i * 2, commentCount: i,
      })),
    },
    {
      id: `pa-${u.id}-4`, type: 'private', name: '私人活动留影',
      photos: Array.from({ length: 2 }, (_, i) => ({
        id: `p-${u.id}-4-${i}`, albumId: `pa-${u.id}-4`, uploaderId: u.id, uploaderName: u.name,
        url: IMG(`private${u.id}${i}`, 1200, 800), thumbnail: IMG(`private${u.id}${i}`, 400, 300),
        caption: ['团建活动', '节日聚会'][i] || '',
        visibility: 'private' as const, takenAt: '2024-06-01', uploadAt: '2024-06-02',
        width: 1200, height: 800, viewCount: 10 + i * 5, likeCount: 5 + i, commentCount: 0,
      })),
    },
  ];
});

// ========== 相册数据 ==========
export const mockAlbums: Album[] = [
  // ── 开学季 ──
  { id: 'a1', parentId: null, name: '开学季', category: 'orientation', sortOrder: 0, coverImage: IMG('orient1', 600, 400), description: '入学报到、开学典礼、开班仪式', isPublic: true, allowDownload: true, photoCount: 0 },
  { id: 'a1-1', parentId: 'a1', name: '2023·入学报到日', category: 'orientation', sortOrder: 0, coverImage: IMG('orient2', 600, 400), description: '2023年9月，港大校园报到日花絮', isPublic: true, allowDownload: true, photoCount: 18, year: '2023', city: '香港' },
  { id: 'a1-2', parentId: 'a1', name: '开学典礼·开班仪式', category: 'orientation', sortOrder: 1, coverImage: IMG('orient3', 600, 400), description: '港大北大联合开学典礼及DBA5班开班仪式', isPublic: true, allowDownload: true, photoCount: 25, year: '2023', city: '香港' },
  { id: 'a1-3', parentId: 'a1', name: '首次班会·新生破冰', category: 'orientation', sortOrder: 2, coverImage: IMG('orient4', 600, 400), description: 'DBA5班首次班会及破冰活动', isPublic: true, allowDownload: true, photoCount: 20, year: '2023', city: '香港' },

  // ── 课程学习 ──
  { id: 'a2', parentId: null, name: '课程学习', category: 'course', sortOrder: 1, coverImage: IMG('course1', 600, 400), description: '校内线下授课、课堂讨论、师生交流', isPublic: true, allowDownload: true, photoCount: 0 },
  { id: 'a2-1', parentId: 'a2', name: '2023秋·战略管理课程', category: 'course', sortOrder: 0, coverImage: IMG('course2', 600, 400), description: '战略管理课程授课与讨论', isPublic: true, allowDownload: true, photoCount: 32, year: '2023', city: '北京' },
  { id: 'a2-2', parentId: 'a2', name: '2024春·组织行为学', category: 'course', sortOrder: 1, coverImage: IMG('course3', 600, 400), description: '组织行为学课堂精彩瞬间', isPublic: true, allowDownload: true, photoCount: 28, year: '2024', city: '香港' },
  { id: 'a2-3', parentId: 'a2', name: '课堂汇报·师生交流', category: 'course', sortOrder: 2, coverImage: IMG('course4', 600, 400), description: '各课程汇报及课后研讨', isPublic: true, allowDownload: true, photoCount: 22, year: '2024', city: '北京' },

  // ── 研学实践 ──
  { id: 'a3', parentId: null, name: '研学实践', category: 'research', sortOrder: 2, coverImage: IMG('research1', 600, 400), description: '企业参访、实地调研、行业游学', isPublic: true, allowDownload: true, photoCount: 0 },
  { id: 'a3-1', parentId: 'a3', name: '深圳·华为参访', category: 'research', sortOrder: 0, coverImage: IMG('research2', 600, 400), description: '华为总部企业参访与交流', isPublic: true, allowDownload: true, photoCount: 35, year: '2024', city: '深圳' },
  { id: 'a3-2', parentId: 'a3', name: '上海·金融企业调研', category: 'research', sortOrder: 1, coverImage: IMG('research3', 600, 400), description: '上海金融机构实地调研', isPublic: true, allowDownload: true, photoCount: 30, year: '2024', city: '上海' },
  { id: 'a3-3', parentId: 'a3', name: '新加坡·国际研学', category: 'research', sortOrder: 2, coverImage: IMG('research4', 600, 400), description: '新加坡国际研学之旅', isPublic: true, allowDownload: true, photoCount: 45, year: '2024', city: '新加坡' },

  // ── 班级活动 ──
  { id: 'a4', parentId: null, name: '班级活动', category: 'activities', sortOrder: 3, coverImage: IMG('activity1', 600, 400), description: '团建聚餐、主题沙龙、学术论坛', isPublic: true, allowDownload: true, photoCount: 0 },
  { id: 'a4-1', parentId: 'a4', name: '2024新春团拜会', category: 'activities', sortOrder: 0, coverImage: IMG('activity2', 600, 400), description: 'DBA5班2024年新春团拜会', isPublic: true, allowDownload: true, photoCount: 26, year: '2024', city: '北京' },
  { id: 'a4-2', parentId: 'a4', name: '每月学术沙龙', category: 'activities', sortOrder: 1, coverImage: IMG('activity3', 600, 400), description: '班级定期学术沙龙活动', isPublic: true, allowDownload: true, photoCount: 20, year: '2024', city: '香港' },
  { id: 'a4-3', parentId: 'a4', name: '高尔夫友谊赛', category: 'activities', sortOrder: 2, coverImage: IMG('activity4', 600, 400), description: '班级体育休闲活动', isPublic: true, allowDownload: true, photoCount: 15, year: '2024', city: '深圳' },

  // ── 毕业纪念 ──
  { id: 'a5', parentId: null, name: '毕业纪念', category: 'graduation', sortOrder: 4, coverImage: IMG('grad1', 600, 400), description: '毕业答辩、毕业典礼、毕业合影', isPublic: true, allowDownload: true, photoCount: 0 },
  { id: 'a5-1', parentId: 'a5', name: '博士学位授予仪式', category: 'graduation', sortOrder: 0, coverImage: IMG('grad2', 600, 400), description: '博士学位授予典礼', isPublic: true, allowDownload: true, photoCount: 30, year: '2025', city: '香港' },
  { id: 'a5-2', parentId: 'a5', name: '毕业晚宴之夜', category: 'graduation', sortOrder: 1, coverImage: IMG('grad3', 600, 400), description: '毕业晚宴精彩瞬间', isPublic: true, allowDownload: true, photoCount: 25, year: '2025', city: '香港' },
  { id: 'a5-3', parentId: 'a5', name: '毕业大合影', category: 'graduation', sortOrder: 2, coverImage: IMG('grad4', 600, 400), description: 'DBA5班毕业大合影集', isPublic: true, allowDownload: true, photoCount: 12, year: '2025', city: '香港' },
];

// ========== 照片数据 ==========
const photoSeeds = [
  'photo1', 'photo2', 'photo3', 'photo4', 'photo5', 'photo6', 'photo7', 'photo8',
  'photo9', 'photo10', 'photo11', 'photo12', 'photo13', 'photo14', 'photo15', 'photo16',
];

export const mockPhotos: Photo[] = [];
const subAlbums = mockAlbums.filter(a => a.parentId !== null);
subAlbums.forEach((album) => {
  const count = Math.min(album.photoCount, 8); // mock 限制每相册展示8张
  for (let i = 0; i < count; i++) {
    const seed = photoSeeds[(i + album.id.charCodeAt(2)) % photoSeeds.length];
    const isLandscape = (i + album.id.length) % 3 !== 0;
    mockPhotos.push({
      id: `ph-${album.id}-${i}`,
      albumId: album.id,
      uploaderId: mockUsers[i % mockUsers.length].id,
      uploaderName: mockUsers[i % mockUsers.length].name,
      url: IMG(`${seed}-${album.id}-${i}`, 1200, isLandscape ? 800 : 1000),
      thumbnail: IMG(`${seed}-${album.id}-${i}`, 400, isLandscape ? 267 : 333),
      caption: `${album.name} - 精彩瞬间 ${i + 1}`,
      visibility: i % 5 === 0 ? 'class_only' : 'public',
      takenAt: `${album.year || '2024'}-0${(i % 9) + 1}-1${i % 9}`,
      uploadAt: `${album.year || '2024'}-0${(i % 9) + 1}-1${(i % 9) + 1}`,
      width: 1200, height: isLandscape ? 800 : 1000,
      viewCount: Math.floor(Math.random() * 200) + 20,
      likeCount: Math.floor(Math.random() * 50) + 5,
      commentCount: Math.floor(Math.random() * 10),
    });
  }
});

// ========== 评论数据 ==========
export const mockComments: Comment[] = [
  { id: 'c1', photoId: mockPhotos[0]?.id || 'p1', userId: 'u2', userName: '李慧琳', userAvatar: AVATAR('5'), content: '这张照片拍得太好了，满满的回忆！', createdAt: '2024-01-15 10:30', likeCount: 5 },
  { id: 'c2', photoId: mockPhotos[0]?.id || 'p1', userId: 'u3', userName: '王建国', userAvatar: AVATAR('13'), content: '时光飞逝，恍如昨日。', createdAt: '2024-01-15 14:20', likeCount: 3 },
  { id: 'c3', photoId: mockPhotos[1]?.id || 'p2', userId: 'u4', userName: '陈雅文', userAvatar: AVATAR('9'), content: '大家那时候都好年轻啊！', createdAt: '2024-01-16 09:15', likeCount: 8 },
];

// ========== 公告数据 ==========
export const mockAnnouncements: Announcement[] = [
  { id: 'an1', title: '2025年春季学期课程安排通知', content: '各位同学，2025年春季学期课程将于3月15日在北京大学开课，请提前安排好行程。具体课程表已发送至各位邮箱，请注意查收。', publisherId: 'u1', publisherName: '张明远', isPinned: true, createdAt: '2025-02-20' },
  { id: 'an2', title: 'DBA5班年度校友聚会邀请', content: '亲爱的同学们，我们计划于2025年6月举办年度校友聚会，届时将有学术分享、班级聚餐等精彩环节，敬请期待！', publisherId: 'u1', publisherName: '张明远', isPinned: false, createdAt: '2025-03-01' },
  { id: 'an3', title: '毕业纪念册征稿启事', content: '为记录我们DBA5班的珍贵回忆，现面向全体同学征集毕业纪念册素材，包括个人感言、珍贵照片、寄语等。投稿截止日期：2025年4月30日。', publisherId: 'u1', publisherName: '张明远', isPinned: false, createdAt: '2025-03-10' },
];

// ========== 留言墙数据 ==========
export const mockMessages: Message[] = [
  { id: 'm1', userId: 'u2', userName: '李慧琳', userAvatar: AVATAR('5'), content: '三年DBA旅程，收获的不仅是学位，更是一群志同道合的挚友。感恩港大北大，感恩DBA5班的每一位同学！', images: [IMG('msg1', 800, 600)], isPinned: true, createdAt: '2025-03-15 10:00', likeCount: 28 },
  { id: 'm2', userId: 'u3', userName: '王建国', userAvatar: AVATAR('13'), content: '从开学到毕业，每一段经历都是宝贵财富。愿我们永远保持学者的谦逊和创业者的勇气。', images: [], isPinned: false, createdAt: '2025-03-14 15:30', likeCount: 15 },
  { id: 'm3', userId: 'u4', userName: '陈雅文', userAvatar: AVATAR('9'), content: '感谢教授们的悉心指导，感谢同学们的真诚相伴。DBA5班，永远是我们共同的家！', images: [IMG('msg2', 800, 600)], isPinned: false, createdAt: '2025-03-13 09:20', likeCount: 22 },
  { id: 'm4', userId: 'u5', userName: '刘志强', userAvatar: AVATAR('15'), content: '学术与实践的碰撞，让我对企业战略有了全新思考。这段旅程值得一生珍藏。', images: [], isPinned: false, createdAt: '2025-03-12 18:00', likeCount: 12 },
];

// ========== 大事记数据 ==========
export const mockTimelineEvents: TimelineEvent[] = [
  { id: 't1', year: '2023', title: 'DBA5班正式开班', description: '香港大学与北京大学联合管理学博士DBA第5期正式开学，32位优秀企业家学者齐聚一堂。', albumId: 'a1-2', eventDate: '2023-09-15', icon: '🎓' },
  { id: 't2', year: '2023', title: '首次课程·战略管理', description: '在北京大学开展首次正式课程，战略管理主题深入探讨。', albumId: 'a2-1', eventDate: '2023-10-20', icon: '📚' },
  { id: 't3', year: '2024', title: '华为企业参访', description: '赴深圳华为总部进行企业参访，深入了解中国科技企业的创新之路。', albumId: 'a3-1', eventDate: '2024-05-18', icon: '🌐' },
  { id: 't4', year: '2024', title: '新加坡国际研学', description: '赴新加坡开展国际研学，参访亚洲领先企业及高校。', albumId: 'a3-3', eventDate: '2024-08-10', icon: '✈️' },
  { id: 't5', year: '2024', title: '年度学术论坛', description: 'DBA5班主办年度学术论坛，多位同学分享研究成果。', albumId: 'a4-2', eventDate: '2024-11-30', icon: '🎤' },
  { id: 't6', year: '2025', title: '博士学位授予', description: '经过三年刻苦研学，DBA5班同学圆满完成学业，获得博士学位。', albumId: 'a5-1', eventDate: '2025-06-28', icon: '🏆' },
];

// ========== 视频数据 ==========
export const mockVideos: Video[] = [
  { id: 'v1', title: 'DBA5班开学纪录片', thumbnail: IMG('video1', 800, 450), duration: '08:32', uploaderId: 'u1', uploaderName: '张明远', category: '开学季', createdAt: '2023-09-20', viewCount: 320 },
  { id: 'v2', title: '华为参访纪实', thumbnail: IMG('video2', 800, 450), duration: '12:15', uploaderId: 'u2', uploaderName: '李慧琳', category: '研学实践', createdAt: '2024-05-25', viewCount: 210 },
  { id: 'v3', title: '新加坡研学Vlog', thumbnail: IMG('video3', 800, 450), duration: '15:48', uploaderId: 'u3', uploaderName: '王建国', category: '研学实践', createdAt: '2024-08-15', viewCount: 185 },
  { id: 'v4', title: '毕业纪念短片', thumbnail: IMG('video4', 800, 450), duration: '20:30', uploaderId: 'u1', uploaderName: '张明远', category: '毕业纪念', createdAt: '2025-07-01', viewCount: 450 },
];

// ========== 下载素材数据 ==========
export const mockDownloads: DownloadItem[] = [
  { id: 'd1', title: 'DBA5班毕业大合影（高清原图）', fileUrl: '#', fileType: 'jpg', fileSize: '24.5 MB', uploaderName: '张明远', createdAt: '2025-07-01', downloadCount: 28 },
  { id: 'd2', title: '班级纪念海报·设计版', fileUrl: '#', fileType: 'png', fileSize: '8.2 MB', uploaderName: '张明远', createdAt: '2025-07-01', downloadCount: 22 },
  { id: 'd3', title: 'DBA5班电子纪念册', fileUrl: '#', fileType: 'pdf', fileSize: '156 MB', uploaderName: '张明远', createdAt: '2025-07-05', downloadCount: 30 },
  { id: 'd4', title: '三年精彩瞬间合集', fileUrl: '#', fileType: 'zip', fileSize: '2.1 GB', uploaderName: '张明远', createdAt: '2025-07-05', downloadCount: 15 },
];

// ========== 统计数据 ==========
export const mockStats = {
  totalPhotos: mockPhotos.length + 280,
  totalAlbums: mockAlbums.filter(a => a.parentId !== null).length,
  totalUsers: mockUsers.length,
  todayUploads: 5,
  activeUsers7d: 18,
  totalViews: 12580,
  totalComments: 156,
  totalDownloads: 95,
  weeklyTrend: [120, 150, 180, 200, 170, 210, 250],
  topAlbums: [
    { name: '新加坡·国际研学', views: 890 },
    { name: '开学典礼·开班仪式', views: 750 },
    { name: '博士学位授予仪式', views: 680 },
    { name: '华为参访', views: 520 },
    { name: '2024新春团拜会', views: 430 },
  ],
  topUsers: [
    { name: '张明远', uploads: 45 },
    { name: '李慧琳', uploads: 38 },
    { name: '王建国', uploads: 32 },
    { name: '陈雅文', uploads: 28 },
    { name: '刘志强', uploads: 25 },
  ],
};
