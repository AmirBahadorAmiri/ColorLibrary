// developed by web-premium.ir
jQuery(document).ready(function(e) {
    function t(e, t = "block") {
        e && e.length && ("none" === e.css("display") && e.css("display", t),
        requestAnimationFrame(function() {
            setTimeout(function() {
                e.addClass("visible")
            }, 20)
        }))
    }
    e(".satisfaction-text .percentage").each(function() {
        e(this).text(function e(t) {
            let n = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
            return t.toString().replace(/\d/g, function(e) {
                return n[e]
            })
        }(e(this).text()))
    }),
    e(document).ready(function() {
        function renderMd(str) {
            if (typeof marked !== "undefined") {
                marked.setOptions({ breaks: true });
                return marked.parse(str);
            }
            return String(str)
                .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
                .replace(/\n/g, "<br>");
        }
        function revealExtras(n) {
            n.find(".pros-cons-container").css("display", "flex").addClass("visible");
            n.find(".pro-item, .con-item").css("display", "inline-flex").addClass("visible");
            n.find(".disclaimer").css("display", "block").addClass("visible");
            n.find(".feedback-container").css("display", "flex").addClass("visible");
        }

        e(".hmyt-ai-review-summary").each(function() {
            var n = e(this);
            n.addClass("visible");
            if (!n.length || n.hasClass("has-animated")) return;
            n.addClass("has-animated");

            var a = n.find(".summary-text");
            var s = a.text().trim();

            if (s.length > 0) {
                a.html(renderMd(s));
            }
            revealExtras(n);
        })
    })
    e(document).on("click", ".feedback-btn", function() {
        var t = e(this)
          , n = t.hasClass("like-btn") ? "positive" : "negative"
          , i = t.data("product-id") || t.data("post-id")
          , a = t.closest(".feedback-container").data("summary-type")
          , s = ""
          , o = {
            type: n,
            summary_type: a,
            security: hmyt_ai_vars.nonce
        };
        "reviews" === a || "description" === a ? (s = "save_feedback",
        o.product_id = i) : ("post_reviews" === a || "post_content" === a) && (s = "save_post_feedback",
        o.post_id = i),
        e.ajax({
            url: hmyt_ai_vars.ajax_url,
            type: "POST",
            data: {
                action: s,
                ...o
            },
            success: function(e) {
                e.success ? (toast.success(e.data.message),
                t.addClass("active").siblings(".feedback-btn").removeClass("active")) : (toast.error(e.data.message || "خطای ناشناخته در ثبت بازخورد."),
                e.data.redirect && "yes" === hmyt_ai_vars.redirect_on_not_logged_in && hmyt_ai_vars.login_url && (toast.loading(hmyt_ai_vars.redirect_message),
                setTimeout(function() {
                    window.location.href = hmyt_ai_vars.login_url
                }, 2e3)))
            },
            error: function(e, t, n) {
                toast.error("خطا در ارتباط با سرور: " + n),
                console.error("AJAX Error:", t, n, e)
            }
        })
    })
});