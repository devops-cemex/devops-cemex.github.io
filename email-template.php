<?php
/**
 * Renders a professional HTML email for form submissions.
 * Safe for Gmail, Outlook, Apple Mail.
 */

function renderEmailTemplate(array $data): string
{
    $row = function (string $label, string $value): string {
        return "
        <tr>
            <td style='padding:6px 0;color:#6b7280;width:30%;vertical-align:top;'>{$label}</td>
            <td style='padding:6px 0;color:#111827;'>{$value}</td>
        </tr>";
    };

    $html = "
<!DOCTYPE html>
<html>
<head>
<meta charset='UTF-8'>
<title>New Form Submission</title>
</head>
<body style='margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif'>
<table width='100%' cellpadding='0' cellspacing='0'>
<tr>
<td align='center' style='padding:30px 15px'>
<table width='600' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:6px;overflow:hidden'>

<tr>
<td style='padding:25px;text-align:center;border-bottom:1px solid #e5e7eb'>
<h2 style='margin:0;color:#111827'>New Form Submission</h2>
<p style='margin:6px 0 0;color:#6b7280;font-size:14px'>{$data['subject']}</p>
</td>
</tr>

<tr>
<td style='padding:20px 25px;font-size:14px;color:#374151'>
<strong>Submitted:</strong> " . date('F j, Y · g:i A') . "<br>
<strong>Source:</strong> " . htmlspecialchars($data['page'] ?? 'Website') . "
</td>
</tr>

<tr>
<td style='padding:0 25px 25px'>
<table width='100%' cellpadding='0' cellspacing='0' style='font-size:14px'>
" . $row('Name', htmlspecialchars($data['name'])) . "
" . $row('Email', htmlspecialchars($data['email'])) . "
";

    if (!empty($data['phone'])) {
        $html .= $row('Phone', htmlspecialchars($data['phone']));
    }
    if (!empty($data['type'])) {
        $html .= $row('Project Type', htmlspecialchars($data['type']));
    }
    if (!empty($data['timeline'])) {
        $html .= $row('Timeline', htmlspecialchars($data['timeline']));
    }
    if (!empty($data['budget'])) {
        $html .= $row('Budget', htmlspecialchars($data['budget']));
    }

    $html .= "
<tr>
<td style='padding:6px 0;color:#6b7280;vertical-align:top'>Message</td>
<td style='padding:6px 0'>" . nl2br(htmlspecialchars($data['message'])) . "</td>
</tr>

</table>
</td>
</tr>

<tr>
<td style='background:#f9fafb;padding:14px 25px;font-size:12px;color:#6b7280;text-align:center'>
This email was generated automatically from your website form.
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>";

    return $html;
}
