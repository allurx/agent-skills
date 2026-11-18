"""Regression cases for the independent reviewer's startup-input checks."""

import json
from pathlib import Path
import sys
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import independent_review


MEMORY_RULE = (
    "- 我明确授权在后续任务全过程中，按相关性和实际复用价值自动读取、新增、更新、合并和删除记忆。"
    "该授权持续有效，直到我撤销，范围内无需逐条重复询问。执行时遵守“记忆维护”的要求。"
)
OTHER_RULE = (
    "- 全面的设计与用户体验审查以目标用户在实际环境中清楚、顺畅、可靠地完成任务为判断基准，"
    "结合项目定位和已确认范围，主动确定应覆盖的页面类型、操作链、状态和使用环境，"
    "不因用户未逐项点名而遗漏适用的响应式布局、移动端适配或可访问性检查。"
)


def message(role, text):
    return {"type": "message", "role": role, "content": [{"type": "input_text", "text": text}]}


class StartupIsolationTests(unittest.TestCase):
    def probe(self, *context, sources=None, references=()):
        marker = "test-review-start"
        messages = [
            message("user", "<environment_context>neutral fixture</environment_context>"),
            *context,
            message("user", marker),
        ]
        if sources is None:
            sources = [("AGENTS.md", MEMORY_RULE + "\n" + OTHER_RULE)]
        with patch.object(independent_review, "checked", return_value=json.dumps(messages)):
            independent_review.startup_probe(["codex"], {}, Path("."), sources, marker, references)

    def test_neutral_memory_heading_is_allowed(self):
        self.probe(message("developer", "## Memory\nThis example documents how a program allocates memory."))

    def test_untagged_rule_is_detected_even_with_a_longer_source_rule(self):
        with self.assertRaises(ValueError):
            self.probe(message("developer", MEMORY_RULE))

    def test_structured_personal_context_is_rejected(self):
        for tag in ("user_instructions", "skills_instructions"):
            with self.subTest(tag=tag), self.assertRaises(ValueError):
                self.probe(message("developer", f"<{tag}>Private fixture</{tag}>"))

    def test_unexpected_user_message_is_rejected(self):
        with self.assertRaises(ValueError):
            self.probe(message("user", "Notes from an earlier conversation."))

    def test_personal_skill_description_in_a_catalog_is_detected(self):
        description = "Check whether an exported report still matches its source for this personal workflow."
        source = '---\nname: report-review\ndescription: "' + description + '"\n---'
        catalog = "## Available skills\n- report-review: " + description
        with self.assertRaisesRegex(ValueError, "report-review"):
            self.probe(message("developer", catalog), sources=[("report-review", source)])

    def test_shared_code_examples_do_not_identify_personal_guidance(self):
        code = "from pathlib import PureWindowsPath"
        reference = ("helper.py", code + "\nprint(PureWindowsPath('.'))")
        instructions = MEMORY_RULE + "\n```python\n" + code + "\n```"
        self.probe(message("developer", code), sources=[("AGENTS.md", instructions)], references=[reference])


if __name__ == "__main__":
    unittest.main()
