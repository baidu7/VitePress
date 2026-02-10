import imaplib
import email
from email.header import decode_header
import json
import os

# 从 GitHub Secrets 读取暗号
mail_user = os.getenv('EMAIL_USER')
mail_pass = os.getenv('EMAIL_PASS')
mail_host = "outlook.office365.com"

def fetch_notes():
    try:
        # 连接 Outlook 邮箱
        mail = imaplib.IMAP4_SSL(mail_host, 993)
        mail.debug = 4
        mail.login(mail_user, mail_pass)
        
        # 重点：这里选择便签文件夹
        # 微软后台通常叫 "Notes"，部分版本可能叫 "便签"
        status, _ = mail.select("Notes")
        if status != 'OK':
            status, _ = mail.select('"%&XfJ6X-环境"') # 兼容某些中文编码
            
        # 搜索所有邮件
        _, data = mail.search(None, "ALL")
        mail_ids = data[0].split()
        
        notes_list = []
        
        for num in mail_ids:
            _, msg_data = mail.fetch(num, "(RFC822)")
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_bytes(response_part[1])
                    
                    # 提取内容
                    content = ""
                    if msg.is_multipart():
                        for part in msg.walk():
                            if part.get_content_type() == "text/plain":
                                content = part.get_payload(decode=True).decode('utf-8')
                    else:
                        content = msg.get_payload(decode=True).decode('utf-8')
                    
                    # 提取时间
                    date_str = msg.get("Date")
                    
                    notes_list.append({
                        "content": content.strip(),
                        "date": date_str,
                        "source": "手机便签"
                    })
        
        # 倒序排列，最新的在前面
        notes_list.reverse()
        
        # 存入 shuo.json
        with open("data/shuo.json", "w", encoding="utf-8") as f:
            json.dump(notes_list, f, ensure_ascii=False, indent=2)
            
        print(f"成功同步了 {len(notes_list)} 条便签！")
        mail.close()
        mail.logout()
        
    except Exception as e:
        print(f"出错了: {e}")

if __name__ == "__main__":
    fetch_notes()