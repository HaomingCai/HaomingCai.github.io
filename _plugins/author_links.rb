module Jekyll
  module AuthorLinksFilter
    def add_author_links(authors_text)
      return authors_text if authors_text.nil? || authors_text.empty?
      
      # 获取作者配置
      authors_data = @context.registers[:site].data['authors'] || {}
      
      # 如果没有配置，直接返回原文本
      return authors_text if authors_data.empty?
      
      result = authors_text.dup
      
      # 按名字长度降序排序，先匹配长名字（避免短名字误匹配）
      sorted_authors = authors_data.keys.sort_by { |k| -k.length }
      
      sorted_authors.each do |name, url|
        next if url.nil? || url.empty? || url.strip.empty?
        
        # 确保URL有协议
        url = url.strip
        unless url.start_with?('http://', 'https://', 'mailto:', '/')
          url = "https://#{url}"
        end
        
        # 转义特殊字符用于正则表达式
        escaped_name = Regexp.escape(name)
        
        # 模式1: 处理 <strong>名字</strong> 或 <strong>名字*</strong>
        strong_pattern = /<strong>\s*(#{escaped_name})\s*(\*?)\s*<\/strong>/i
        result = result.gsub(strong_pattern) do |match|
          has_star = $2 == '*'
          star = has_star ? '*' : ''
          "<strong><a href=\"#{url}\" class=\"author-with-link\" style=\"color: inherit; text-decoration: none;\">#{name}#{star}</a></strong>"
        end
        
        # 模式2: 处理普通名字
        # 使用简单的字符串替换方法：找到所有出现的位置，然后替换
        # 但要确保不在HTML标签内
        
        # 先找到所有匹配位置
        positions = []
        result.scan(/#{escaped_name}(\*?)/i) do |star_match|
          match_data = $~
          positions << {
            start: match_data.begin(0),
            end: match_data.end(0),
            star: star_match[0] || ''
          }
        end
        
        # 从后往前替换，避免位置偏移
        positions.reverse.each do |pos|
          start_pos = pos[:start]
          end_pos = pos[:end]
          
          # 检查是否在HTML标签内
          text_before = result[0...start_pos]
          text_after = result[end_pos..-1]
          
          # 检查是否在<a>标签内
          open_a_before = text_before.scan(/<a\s+[^>]*>/i).length
          close_a_before = text_before.scan(/<\/a>/i).length
          next if open_a_before > close_a_before
          
          # 检查是否在其他HTML标签内（除了<strong>，因为已经处理过了）
          # 查找最后一个未闭合的标签
          last_tag_match = text_before.match(/<([^>]+)[^\/]>(?!.*<\/\1>)/)
          if last_tag_match
            tag_name = last_tag_match[1].split(/\s/)[0]
            # 如果标签不是strong且没有闭合，跳过
            if tag_name != 'strong' && !text_after.include?("</#{tag_name}>")
              next
            end
          end
          
          # 检查名字前后是否是单词边界
          char_before = start_pos > 0 ? result[start_pos - 1] : ' '
          char_after = end_pos < result.length ? result[end_pos] : ' '
          
          # 确保前后不是字母（单词边界）
          next if char_before.match?(/[a-zA-Z]/) || char_after.match?(/[a-zA-Z]/)
          
          # 替换
          star = pos[:star]
          replacement = "<a href=\"#{url}\" class=\"author-with-link\" style=\"color: inherit; text-decoration: none;\">#{name}#{star}</a>"
          result[start_pos...end_pos] = replacement
        end
      end
      
      result
    end
  end
end

Liquid::Template.register_filter(Jekyll::AuthorLinksFilter)
