#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DBA5 班相册 - 腾讯云 COS 批量上传脚本
功能：
  1. 扫描本地照片目录
  2. 自动压缩（最大 1920px 宽，JPEG 质量 85）
  3. 添加水印「港大北大 DBA5 班」
  4. 按分类上传到 COS
  5. 生成 manifest.json 供网站使用
"""

import os
import sys
import json
import hashlib
import datetime
from pathlib import Path
from io import BytesIO

# COS SDK
from qcloud_cos import CosConfig, CosS3Client

# Image processing
from PIL import Image, ImageDraw, ImageFont

# ============ 配置区（从 cos_config.json 读取） ============
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(SCRIPT_DIR, 'cos_config.json')

# 本地照片目录（百度网盘下载的存放位置）
LOCAL_PHOTO_DIR = r"C:\Users\xlpeng\WorkBuddy\2026-07-15-21-15-34\photos"

# 输出 manifest 文件路径
MANIFEST_PATH = os.path.join(SCRIPT_DIR, '..', 'src', 'data', 'photo-manifest.json')


def load_config():
    """从 cos_config.json 加载配置"""
    if not os.path.exists(CONFIG_PATH):
        print(f"错误：配置文件不存在: {CONFIG_PATH}")
        print("请先创建 cos_config.json 文件。")
        sys.exit(1)

    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        cfg = json.load(f)

    return cfg.get('secret_id', ''), cfg.get('secret_key', ''), cfg.get('region', 'ap-guangzhou'), cfg.get('bucket', '')

# 水印文字
WATERMARK_TEXT = "港大北大 DBA5 班"

# 压缩参数
MAX_WIDTH = 1920
JPEG_QUALITY = 85

# 支持的图片格式
IMAGE_EXTS = {'.jpg', '.jpeg', '.png', '.bmp', '.webp', '.tiff'}

# 五大分类关键词映射（按文件名/文件夹名自动分类）
CATEGORY_KEYWORDS = {
    'orientation': ['开学', '入学', '报到', '典礼', '开班', '破冰', '迎新', 'orientation', 'opening'],
    'course': ['课程', '课堂', '授课', '讨论', '汇报', '交流', '研讨', 'course', 'class', 'lecture'],
    'research': ['研学', '参访', '调研', '游学', '考察', '企业', '实地', 'research', 'visit', 'field'],
    'activity': ['活动', '团建', '聚餐', '聚会', '沙龙', '论坛', '体育', '休闲', '节日', 'activity', 'team'],
    'graduation': ['毕业', '答辩', '典礼', '学位', '晚宴', '纪念', 'graduation', 'degree', 'commencement'],
}

DEFAULT_CATEGORY = 'activity'


def detect_category(filepath: str) -> str:
    """根据文件路径和文件名自动检测分类"""
    path_lower = filepath.lower()
    for cat, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if kw.lower() in path_lower:
                return cat
    return DEFAULT_CATEGORY


def add_watermark(img: Image.Image, text: str) -> Image.Image:
    """在图片右下角添加半透明水印"""
    if img.mode != 'RGBA':
        img = img.convert('RGBA')

    # 创建水印图层
    watermark_layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(watermark_layer)

    # 尝试加载字体
    font_size = max(24, img.width // 40)
    font = None
    font_paths = [
        "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/msyhbd.ttc",
        "C:/Windows/Fonts/simhei.ttf",
        "C:/Windows/Fonts/simsun.ttc",
    ]
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                font = ImageFont.truetype(fp, font_size)
                break
            except Exception:
                continue
    if font is None:
        font = ImageFont.load_default()

    # 计算水印位置（右下角，留边距）
    margin = 20
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = img.width - text_w - margin
    y = img.height - text_h - margin

    # 绘制半透明文字 + 背景
    padding = 8
    draw.rectangle(
        [x - padding, y - padding, x + text_w + padding, y + text_h + padding],
        fill=(26, 39, 68, 80)  # 深灰蓝半透明背景
    )
    draw.text((x, y), text, fill=(197, 165, 90, 200), font=font)  # 香槟金文字

    return Image.alpha_composite(img, watermark_layer)


def compress_image(filepath: str) -> tuple[bytes, int, int]:
    """
    压缩图片并添加水印
    返回：(JPEG 二进制数据, 宽度, 高度)
    """
    img = Image.open(filepath)

    # 处理 EXIF 旋转
    try:
        from PIL import ImageOps
        img = ImageOps.exif_transpose(img)
    except Exception:
        pass

    # 调整大小
    if img.width > MAX_WIDTH:
        ratio = MAX_WIDTH / img.width
        new_size = (MAX_WIDTH, int(img.height * ratio))
        img = img.resize(new_size, Image.LANCZOS)

    # 添加水印
    img = add_watermark(img, WATERMARK_TEXT)

    # 转为 JPEG
    if img.mode == 'RGBA':
        # 在白色背景上合成
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3] if len(img.split()) == 4 else None)
        img = background
    elif img.mode != 'RGB':
        img = img.convert('RGB')

    buf = BytesIO()
    img.save(buf, format='JPEG', quality=JPEG_QUALITY, optimize=True)
    data = buf.getvalue()

    return data, img.width, img.height


def upload_to_cos(client, bucket, local_path, cos_key):
    """上传文件到 COS"""
    response = client.put_object(
        Bucket=bucket,
        Body=open(local_path, 'rb') if isinstance(local_path, str) else local_path,
        Key=cos_key,
        EnableMD5=True
    )
    return response


def generate_cos_key(category, filename, index):
    """生成 COS 存储路径"""
    ext = '.jpg'  # 统一转为 jpg
    # 用 hash 避免重名
    name_hash = hashlib.md5(f"{filename}_{index}".encode()).hexdigest()[:8]
    date_str = datetime.datetime.now().strftime('%Y%m')
    return f"photos/{category}/{date_str}/{name_hash}{ext}"


def main():
    # 从配置文件加载
    SECRET_ID, SECRET_KEY, REGION, BUCKET = load_config()

    # 验证配置
    if not SECRET_ID or not SECRET_KEY or not BUCKET:
        print("=" * 60)
        print("错误：请先填写 COS 配置信息！")
        print("=" * 60)
        print()
        print("请编辑此脚本文件，填写以下变量：")
        print(f"  SECRET_ID  = {SECRET_ID or '(未填写)'}")
        print(f"  SECRET_KEY = {'*' * len(SECRET_KEY) if SECRET_KEY else '(未填写)'}")
        print(f"  REGION     = {REGION}")
        print(f"  BUCKET     = {BUCKET or '(未填写)'}")
        print()
        print("获取方式：")
        print("  1. 登录 https://console.cloud.tencent.com/cam/capi")
        print("  2. 创建 API 密钥，获取 SecretId 和 SecretKey")
        print("  3. 在 https://console.cloud.tencent.com/cos 创建存储桶")
        print("     存储桶名称形如: dba5-album-1250000000")
        print("     访问权限设为: 公有读私有写")
        print()
        return

    if not os.path.exists(LOCAL_PHOTO_DIR):
        print(f"错误：照片目录不存在: {LOCAL_PHOTO_DIR}")
        print(f"请先创建目录并放入照片，或修改 LOCAL_PHOTO_DIR 路径。")
        return

    # 初始化 COS 客户端
    config = CosConfig(Region=REGION, SecretId=SECRET_ID, SecretKey=SECRET_KEY, Scheme='https')
    client = CosS3Client(config)

    # 测试连接
    try:
        client.head_bucket(Bucket=BUCKET)
        print(f"COS 连接成功: {BUCKET}")
    except Exception as e:
        print(f"COS 连接失败: {e}")
        return

    # 扫描所有照片
    print(f"\n扫描照片目录: {LOCAL_PHOTO_DIR}")
    photos = []
    for root, dirs, files in os.walk(LOCAL_PHOTO_DIR):
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in IMAGE_EXTS:
                photos.append(os.path.join(root, f))

    print(f"找到 {len(photos)} 张照片")

    if not photos:
        print("没有找到照片，请检查目录。")
        return

    # 上传
    manifest = []
    success = 0
    failed = 0

    for i, filepath in enumerate(photos, 1):
        filename = os.path.basename(filepath)
        rel_path = os.path.relpath(filepath, LOCAL_PHOTO_DIR)
        category = detect_category(rel_path)

        print(f"[{i}/{len(photos)}] 处理: {rel_path} -> {category}", end=" ")

        try:
            # 压缩 + 水印
            img_data, width, height = compress_image(filepath)
            original_size = os.path.getsize(filepath)
            compressed_size = len(img_data)
            compression_ratio = (1 - compressed_size / original_size) * 100 if original_size > 0 else 0

            # 生成 COS 路径
            cos_key = generate_cos_key(category, filename, i)

            # 上传
            client.put_object(
                Bucket=BUCKET,
                Body=img_data,
                Key=cos_key,
                EnableMD5=True
            )

            # 公有读 URL
            cos_url = f"https://{BUCKET}.cos.{REGION}.myqcloud.com/{cos_key}"

            manifest.append({
                'id': f'photo_{i:04d}',
                'url': cos_url,
                'category': category,
                'filename': filename,
                'originalPath': rel_path,
                'width': width,
                'height': height,
                'size': compressed_size,
            })

            success += 1
            print(f"OK ({compressed_size//1024}KB, -{compression_ratio:.0f}%)")

        except Exception as e:
            failed += 1
            print(f"FAILED: {e}")

    # 写入 manifest
    os.makedirs(os.path.dirname(MANIFEST_PATH), exist_ok=True)
    with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump({
            'total': len(manifest),
            'success': success,
            'failed': failed,
            'uploaded_at': datetime.datetime.now().isoformat(),
            'cos_base_url': f"https://{BUCKET}.cos.{REGION}.myqcloud.com",
            'photos': manifest,
        }, f, ensure_ascii=False, indent=2)

    print(f"\n{'=' * 60}")
    print(f"上传完成！成功 {success} 张，失败 {failed} 张")
    print(f"Manifest 已保存: {MANIFEST_PATH}")
    print(f"COS 基础 URL: https://{BUCKET}.cos.{REGION}.myqcloud.com")
    print(f"{'=' * 60}")


if __name__ == '__main__':
    main()
