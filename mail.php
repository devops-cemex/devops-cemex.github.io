<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';
require __DIR__ . '/email-template.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}
/* -----------------------------
   SPAM CHECK (HONEYPOT)
------------------------------*/
// Check if the hidden field 'confirm_email' contains any text.
// If it does, it's a bot submission.
if (!empty($_POST['confirm_email'])) {
    // We stop the script here.
    // We return 'success' => false so you can see it failed while testing.
    echo json_encode(['success' => false, 'message' => 'Spam detection triggered.']);
    exit;
}

/* -----------------------------
   INPUT
------------------------------*/
$name     = trim($_POST['name'] ?? '');
$email    = trim($_POST['email'] ?? '');
$subject  = trim($_POST['subject'] ?? '');
$message  = trim($_POST['message'] ?? '');

$phone    = trim($_POST['phone'] ?? '');
$type     = trim($_POST['type'] ?? '');
$timeline = trim($_POST['timeline'] ?? '');
$budget   = trim($_POST['budget'] ?? '');

if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Required fields missing']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email']);
    exit;
}

$subject = $subject ?: (!empty($type) ? 'New Quote Request' : 'New Contact Message');

/* -----------------------------
   SMTP CONFIG
------------------------------*/
$mail = new PHPMailer(true);

try {
  $mail->isSMTP();
$mail->Host       = 'mail.cpil.com.ng';
$mail->SMTPAuth   = true;
$mail->Username   = 'contact@cpil.com.ng';
$mail->Password   = 'TqJ9.#6I8bedM1';
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port       = 587;
// Headers
$mail->setFrom('contact@cpil.com.ng', 'Website Contact');
$mail->addReplyTo($email, $name);
$mail->addAddress('info@cpil.com.ng');


    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = renderEmailTemplate([
        'name'     => $name,
        'email'    => $email,
        'phone'    => $phone,
        'type'     => $type,
        'timeline' => $timeline,
        'budget'   => $budget,
        'message'  => $message,
        'subject'  => $subject,
        'page'     => $_SERVER['HTTP_REFERER'] ?? ''
    ]);

    $mail->AltBody =
"New Form Submission

Name: $name
Email: $email
Phone: $phone
Type: $type
Timeline: $timeline
Budget: $budget

$message";

    $mail->send();

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $mail->ErrorInfo]);
}
