(function() {
    const reviewMediaCache = new Map();
    const resolvedReviewMedia = new Map();
    let reviewMediaLightbox = null;

    const fetchBuyerMediaGroups = (productId, force = false) => {
        const key = String(productId || '');
        if (!key) return Promise.resolve([]);
        if (!force && reviewMediaCache.has(key)) return reviewMediaCache.get(key);

        const headers = {};
        if (typeof hamyar_comment_data !== 'undefined' && hamyar_comment_data.nonce) {
            headers['X-WP-Nonce'] = hamyar_comment_data.nonce;
        }
        const request = fetch(`${hamyar_comment_data.rest_url}review-media/${encodeURIComponent(key)}`, { headers })
            .then(response => response.ok ? response.json() : Promise.reject(response))
            .then(payload => {
                const groups = Array.isArray(payload.groups) ? payload.groups : [];
                resolvedReviewMedia.set(key, groups);
				window.dispatchEvent(new CustomEvent('hmyt_comment_media_ready', {
					detail: { productId: Number(productId || 0), groups }
				}));
                return groups;
            })
            .catch(error => {
                reviewMediaCache.delete(key);
                resolvedReviewMedia.delete(key);
                throw error;
            });
        reviewMediaCache.set(key, request);
        return request;
    };

    const getFallbackLightbox = () => {
        if (reviewMediaLightbox) return reviewMediaLightbox;

        const root = document.createElement('div');
        root.className = 'hmyt-comment-lightbox';
        root.setAttribute('role', 'dialog');
        root.setAttribute('aria-modal', 'true');
        root.setAttribute('aria-label', 'نمایش تصاویر دیدگاه');
        root.setAttribute('aria-hidden', 'true');
        root.innerHTML = `
            <div class="hmyt-comment-lb-backdrop" data-hmyt-media-close></div>
            <div class="hmyt-comment-lb-dialog" dir="rtl">
                <div class="hmyt-comment-lb-toolbar">
                    <span class="hmyt-comment-lb-counter" aria-live="polite"></span>
                    <button type="button" class="hmyt-comment-lb-close" data-hmyt-media-close aria-label="بستن تصویر">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>
                    </button>
                </div>
                <div class="hmyt-comment-lb-stage">
                    <button type="button" class="hmyt-comment-lb-nav is-prev" aria-label="تصویر قبلی"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>
                    <img class="hmyt-comment-lb-image" alt="" decoding="async">
                    <button type="button" class="hmyt-comment-lb-nav is-next" aria-label="تصویر بعدی"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
                </div>
            </div>`;
        document.body.appendChild(root);

        const image = root.querySelector('.hmyt-comment-lb-image');
        const counter = root.querySelector('.hmyt-comment-lb-counter');
        const closeButton = root.querySelector('.hmyt-comment-lb-close');
        let items = [];
        let index = 0;
        let previousFocus = null;

        const show = nextIndex => {
            if (!items.length) return;
            index = (nextIndex + items.length) % items.length;
            image.src = items[index].url;
            image.alt = items[index].alt || '';
            counter.textContent = `${String(index + 1).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d])} از ${String(items.length).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d])}`;
            root.querySelectorAll('.hmyt-comment-lb-nav').forEach(button => {
                button.hidden = items.length < 2;
            });
        };
        const close = () => {
            if (root.getAttribute('aria-hidden') === 'true') return;
            root.classList.remove('is-open');
            root.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('hmyt-comment-lightbox-open');
            image.removeAttribute('src');
            previousFocus?.focus?.({ preventScroll: true });
        };
        const open = (newItems, startId, trigger) => {
            items = newItems;
            if (!items.length) return;
            index = Math.max(0, items.findIndex(item => String(item.id) === String(startId)));
            previousFocus = trigger || document.activeElement;
            show(index);
            root.setAttribute('aria-hidden', 'false');
            document.body.classList.add('hmyt-comment-lightbox-open');
            requestAnimationFrame(() => {
                root.classList.add('is-open');
                closeButton.focus({ preventScroll: true });
            });
        };

        root.addEventListener('click', event => {
            if (event.target.closest('[data-hmyt-media-close]')) close();
        });
        root.querySelector('.is-prev').addEventListener('click', () => show(index - 1));
        root.querySelector('.is-next').addEventListener('click', () => show(index + 1));
        document.addEventListener('keydown', event => {
            if (root.getAttribute('aria-hidden') === 'true') return;
            if (event.key === 'Escape') {
                event.preventDefault();
                close();
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                show(index - 1);
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                show(index + 1);
            } else if (event.key === 'Tab') {
                const focusable = Array.from(root.querySelectorAll('button:not([hidden]):not([disabled])'))
                    .filter(node => node.offsetParent !== null);
                if (!focusable.length) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        });

        reviewMediaLightbox = { open, close };
        return reviewMediaLightbox;
    };

    document.querySelectorAll('.hmyt-initial-review-media').forEach(node => {
        try {
            const payload = JSON.parse(node.textContent || '{}');
            const key = String(payload.product_id || node.closest('[data-product-id]')?.dataset.productId || '');
            const groups = Array.isArray(payload.groups) ? payload.groups : [];
            if (!key) return;
            resolvedReviewMedia.set(key, groups);
            reviewMediaCache.set(key, Promise.resolve(groups));
        } catch (error) {
            // Invalid bootstrap data falls back to the REST request below.
        }
    });

    window.HMYTCommentMedia = Object.assign(window.HMYTCommentMedia || {}, {
        getGroups: fetchBuyerMediaGroups,
        peek(productId) {
            const key = String(productId || '');
            return resolvedReviewMedia.has(key) ? resolvedReviewMedia.get(key) : null;
        },
        invalidate(productId) {
			const key = String(productId || '');
            reviewMediaCache.delete(key);
            resolvedReviewMedia.delete(key);
			window.dispatchEvent(new CustomEvent('hmyt_comment_media_invalidated', {
				detail: { productId: Number(productId || 0) }
			}));
        }
    });

    // The script is normally printed in the footer, so product comment roots
    // are already available here. Prime immediately to hide REST latency from
    // the first gallery opening; dynamically inserted roots are primed below.
    document.querySelectorAll('#hamyar-comment-app[data-is-product="1"][data-product-id]').forEach(root => {
        fetchBuyerMediaGroups(root.dataset.productId).catch(() => {});
    });

    const initCommentApp = (app) => {
    if (!app || app.dataset.hmytCommentInitialized === '1') return;
    app.dataset.hmytCommentInitialized = '1';

    const productId = app.dataset.productId;
    const isProduct = app.dataset.isProduct === '1';

    // Start the request with the comment app, not when the gallery opens. The
    // gallery can then consume the resolved value synchronously through peek().
    if (isProduct && productId) {
		const needsViewerRefresh = hamyar_comment_data?.is_logged_in === '1';
		fetchBuyerMediaGroups(productId, needsViewerRefresh).catch(() => {});
	}
    const rateTip = document.getElementById('product-rate-tip');
    const rateTipClose = document.getElementById('product-rate-tip-close');
    const commentList = document.getElementById('comment-list');
	const smartExcerptEnabled = hamyar_comment_data?.smart_excerpt_enabled === '1';
	let smartExcerptSequence = 0;
	let smartExcerptResizeTimer = 0;

	const prepareSmartExcerpt = (text, force = false) => {
		if (!smartExcerptEnabled || !text || text.dataset.smartExcerptExpanded === '1') return;

		const currentControl = text.nextElementSibling?.classList.contains('hmyt-comment-text-more')
			? text.nextElementSibling
			: null;
		if (currentControl && !force) return;
		currentControl?.remove();

		text.classList.add('hmyt-smart-comment-text');
		text.classList.remove('is-smart-collapsed');
		const fullHeight = text.scrollHeight;
		text.classList.add('is-smart-collapsed');
		const collapsedHeight = text.getBoundingClientRect().height;

		if (fullHeight <= collapsedHeight + 2) {
			text.classList.remove('is-smart-collapsed');
			return;
		}

		if (!text.id) {
			smartExcerptSequence += 1;
			text.id = `hmyt-smart-comment-text-${productId}-${smartExcerptSequence}`;
		}

		const more = document.createElement('button');
		more.type = 'button';
		more.className = 'hmyt-comment-text-more';
		more.setAttribute('aria-expanded', 'false');
		more.setAttribute('aria-controls', text.id);
		more.innerHTML = '<span>ادامه</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
		text.insertAdjacentElement('afterend', more);
	};

	const prepareSmartExcerpts = (scope = commentList, force = false) => {
		if (!smartExcerptEnabled || !scope) return;
		const texts = [];
		if (scope.matches?.('.hmyt-comment-text')) texts.push(scope);
		scope.querySelectorAll?.('.hmyt-comment-text').forEach(text => texts.push(text));
		texts.forEach(text => prepareSmartExcerpt(text, force));
	};
    
    const loader = document.getElementById('comment-list-loader');
    const loadMoreContainer = document.getElementById('load-more-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const moreLoader = document.getElementById('hmyt-more-loader');
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    
    const modal = document.getElementById('hamyar-comment-modal');
    // Portal the dialog to <body> so Elementor/theme stacking contexts cannot cover it.
    if (modal && modal.parentElement !== document.body) document.body.appendChild(modal);
    const commentForm = document.getElementById('hamyar-comment-form');
    const showFormBtn = document.getElementById('show-comment-form-btn');
    const floatingBtn = document.getElementById('comment-floating-btn');
    const ratingWrapper = modal?.querySelector('#rating-wrapper');
    const commentStep = modal?.querySelector('#product-rate-modal-comment');
    const modalFooter = modal?.querySelector('.hmyt-review-modal-footer');
    const stepLabel = modal?.querySelector('.hmyt-review-step-label');
    const reviewTextarea = modal?.querySelector('.product-rate-modal-comment-input');
    const reviewSubmitButton = modal?.querySelector('.product-rate-modal-submit');
    const reviewNextButton = modal?.querySelector('.hmyt-review-next-step');
    const reviewLegalNote = modal?.querySelector('.hmyt-review-legal-note');
    const reviewRatingEditor = modal?.querySelector('.hmyt-review-rating-editor');
    const reviewRatingStars = reviewRatingEditor?.querySelector('.hmyt-review-rating-editor__stars');
    const reviewRatingValue = reviewRatingEditor?.querySelector('.hmyt-review-rating-editor__value > span');
    const reviewRatingButtons = reviewRatingEditor?.querySelectorAll('[data-review-rating-value]') || [];
    const identityLayer = modal?.querySelector('.hmyt-review-identity-layer');
    const productCard = modal?.querySelector('.hmyt-review-product-card');
    const modalScroll = modal?.querySelector('.hmyt-review-modal-scroll');
    const modalCloseButton = modal?.querySelector('.product-rate-modal-close');
    let selectedReviewFiles = [];
    let previewObjectUrls = [];
    let lastModalTrigger = null;

    let state = {
        currentPage: 1,
        totalPages: 1,
        currentFilter: 'all',
        currentSort: 'newest',
        isLoading: false,
    };

    const isRatingRequired = () => commentForm?.dataset.ratingRequired === '1';

    const syncRatingControls = (rating) => {
        const selectedRating = Math.max(0, Math.min(5, Number(rating) || 0));
        const ratingInput = commentForm?.querySelector('input[name="rating"]');
        const ratingContainer = modal?.querySelector('#product-rate-modal-rate-options');

        if (ratingInput) ratingInput.value = String(selectedRating);
        if (ratingContainer) {
            ratingContainer.className = 'product-rate-modal-rate-options hmyt-u-flex hmyt-u-flex-r hmyt-u-flex-icenter';
            if (selectedRating > 0) ratingContainer.classList.add(`select-${selectedRating}`);
        }

        modal?.querySelectorAll('.product-rate-modal-option').forEach(option => {
            option.setAttribute('aria-checked', Number(option.dataset.value) === selectedRating ? 'true' : 'false');
        });

        reviewRatingButtons.forEach(button => {
            const value = Number(button.dataset.reviewRatingValue);
            button.classList.toggle('is-active', value <= selectedRating);
            button.setAttribute('aria-checked', value === selectedRating ? 'true' : 'false');
        });

        if (reviewRatingValue) reviewRatingValue.textContent = selectedRating > 0 ? toPersianNum(selectedRating) : '۰';
    };

    const syncModalFooter = () => {
        if (!modalFooter) return;

        const isRatingStep = isRatingRequired() && commentForm?.dataset.composerStep === '1';
        const hasSelectedRating = Number(commentForm?.querySelector('input[name="rating"]')?.value || 0) > 0;

        modalFooter.hidden = isRatingStep && !hasSelectedRating;
        if (reviewNextButton) reviewNextButton.hidden = !isRatingStep || !hasSelectedRating;
        if (reviewSubmitButton) reviewSubmitButton.hidden = isRatingStep;
        if (reviewLegalNote) reviewLegalNote.hidden = isRatingStep;
    };

    const updateSubmitState = () => {
        if (!commentForm || !reviewSubmitButton) return;
        const contentReady = (reviewTextarea?.value.trim().length || 0) >= 5;
        const ratingReady = !isRatingRequired() || Number(commentForm.querySelector('input[name="rating"]')?.value || 0) > 0;
        reviewSubmitButton.disabled = !contentReady || !ratingReady || commentForm.dataset.submitting === '1';
    };

    const setComposerStep = (step) => {
        const needsRating = isRatingRequired();
        const normalizedStep = needsRating && step === 1 ? 1 : 2;
        if (commentForm) commentForm.dataset.composerStep = String(normalizedStep);
        if (productCard) productCard.hidden = needsRating && normalizedStep === 2;
        if (ratingWrapper) ratingWrapper.hidden = !needsRating || normalizedStep === 2;
        if (commentStep) commentStep.hidden = needsRating && normalizedStep === 1;
        if (reviewRatingEditor) reviewRatingEditor.hidden = !needsRating || normalizedStep !== 2;
        syncModalFooter();
        if (stepLabel) stepLabel.textContent = needsRating ? `مرحله ${toPersianNum(normalizedStep)} از ۲` : '';
        if (modalCloseButton) {
            modalCloseButton.setAttribute('aria-label', needsRating && normalizedStep === 2 ? 'بازگشت به مرحله امتیازدهی' : 'بستن مودال');
        }
        if (modalScroll) modalScroll.scrollTop = 0;
        updateSubmitState();
    };

    const revokePreviewUrls = () => {
        previewObjectUrls.forEach(url => URL.revokeObjectURL(url));
        previewObjectUrls = [];
    };

    const resetComposer = () => {
        if (!commentForm) return;
        commentForm.reset();
        commentForm.dataset.submitting = '0';
        syncRatingControls(0);
        selectedReviewFiles = [];
        revokePreviewUrls();
        renderMediaPreviews();
        resetIdentitySelection();
        updateCommentTitle(0);
        setComposerStep(isRatingRequired() ? 1 : 2);
    };

    const openModal = (trigger = null) => {
        if (modal) {
            lastModalTrigger = trigger instanceof HTMLElement ? trigger : document.activeElement;
            resetComposer();
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('hmyt-review-modal-open');
            requestAnimationFrame(() => {
                const focusTarget = isRatingRequired()
                    ? modal.querySelector('.product-rate-modal-option')
                    : reviewTextarea;
                focusTarget?.focus();
            });
        }
    };
    const closeModal = () => {
        if (!modal) return;
        closeIdentityDialog();
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('hmyt-review-modal-open');
        resetComposer();
        lastModalTrigger?.focus?.();
    };

    const isUserLoggedIn = showFormBtn.dataset.isLoggedIn === '1';
    const loginUrl = showFormBtn.dataset.loginUrl;

    const handleNewCommentClick = (e) => {
        if (isUserLoggedIn) {
            openModal(e.currentTarget || e.target);
        } else {
            e.preventDefault();
            const redirectEnabled = (typeof hamyar_comment_data !== 'undefined' && hamyar_comment_data.guest_redirect_enabled === '1');
            
            if (redirectEnabled && loginUrl) {
                toast.error('برای ثبت دیدگاه ابتدا باید وارد حساب کاربری خود شوید.');
                setTimeout(() => {
                    toast.loading('در حال انتقال به صفحه ورود...');
                    setTimeout(() => {
                        window.location.href = loginUrl;
                    }, 1000);
                }, 1500);
            } else {
                toast.error('برای ثبت دیدگاه باید وارد شوید.');
            }
        }
    };

    
    const toPersianNum = (num) => {
        if (num === null || num === undefined) return '';
        return num.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
    };

    const fetchReviews = (scrollToTop = false) => {
        if (state.isLoading) return;
        state.isLoading = true;

        const isFirstPage = (state.currentPage === 1);
        const infiniteScroll = hamyar_comment_data.infinite_scroll_enabled === '1';

        if (isFirstPage) {
            loader.style.display = 'block';
            loadMoreContainer.style.display = 'none';
            commentList.innerHTML = '';
        } else {
            if (moreLoader) moreLoader.style.display = 'flex';
            loadMoreBtn.style.display = 'none';
        }

        const { currentPage, currentFilter, currentSort } = state;
        const apiUrl = `${hamyar_comment_data.rest_url}reviews/${productId}?page=${currentPage}&filter=${currentFilter}&orderby=${currentSort}`;

        const fetchHeaders = {};
        if (isUserLoggedIn && hamyar_comment_data.nonce) {
            fetchHeaders['X-WP-Nonce'] = hamyar_comment_data.nonce;
        }

        fetch(apiUrl, {
            headers: fetchHeaders
        })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(data => {
            state.totalPages = data.pagination.total_pages;
            if (isFirstPage) {
                commentList.innerHTML = data.html || `<p class="no-comments">${hamyar_comment_data.no_comments_text}</p>`;
            } else if (data.html) {
                commentList.insertAdjacentHTML('beforeend', data.html);
            }
			prepareSmartExcerpts(commentList);

            if (isFirstPage) {
                const aiWrapper = document.getElementById('ai-summary-wrapper');
                if (aiWrapper) aiWrapper.style.display = 'block';
            }
            updateRatingAbility(data.user_status);

            if (scrollToTop) {
                commentList.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            if (state.currentPage < state.totalPages) {
                loadMoreContainer.style.display = 'block';
                if (!infiniteScroll) loadMoreBtn.style.display = '';
            } else {
                loadMoreContainer.style.display = 'none';
            }
        })
        .catch(err => {
            if (isFirstPage) {
                commentList.innerHTML = `<p class="no-comments">${hamyar_comment_data.no_comments_text || 'خطایی در بارگذاری نظرات رخ داد.'}</p>`;
            } else {
                if (typeof toast !== 'undefined') toast.error('خطا در بارگذاری دیدگاه‌های بیشتر.');
                if (!infiniteScroll) loadMoreBtn.style.display = '';
            }
            console.error('Fetch Error:', err);
        })
        .finally(() => {
            if (isFirstPage) loader.style.display = 'none';
            if (moreLoader) moreLoader.style.display = 'none';
            state.isLoading = false;
        });
    };
    

    const updateRatingAbility = (userStatus) => {
        const rateTip = document.getElementById('product-rate-tip');
        const canRate = Boolean(isProduct && userStatus?.can_rate);

        if (commentForm) commentForm.dataset.ratingRequired = canRate ? '1' : '0';
        if (ratingWrapper) ratingWrapper.hidden = !canRate;

        if (!isProduct) {
            if (rateTip) rateTip.classList.add('hide');
            setComposerStep(2);
            return;
        }

        if (canRate) {
            if (rateTip) rateTip.classList.remove('hide');
        } else {
            if (rateTip) rateTip.classList.add('hide');
        }
        
        if (commentForm) {
            const ratingInput = commentForm.querySelector('input[name="rating"]');
            updateCommentTitle(ratingInput.value);
        }
        if (!modal || modal.style.display === 'none') setComposerStep(canRate ? 1 : 2);
    };

    const updateCommentTitle = (rating) => {
        const titleElement = document.getElementById('product-rate-modal-comment-title');
        if (!titleElement) return;

        const hasSelectedRating = isRatingRequired() && Number(rating) > 0;

        if (hasSelectedRating) {
            titleElement.style.display = 'block';
            const titles = {
                1: 'چه بد! چیکار کنیم خوشحالتون کنه؟ <small>(برامون بنویسید)</small>',
                2: 'واقعا متاسفیم! چرا از محصول راضی نبودید؟ <small>(برامون بنویسید)</small>',
                3: 'برای بهبود محصول چه پیشنهادی دارید؟ <small>(برای ما مهمه)</small>',
                4: 'چطور از شما ۵ ستاره بگیریم؟ <small>(برامون بنویسید)</small>',
                5: 'خوشحالیم که راضی بودید! <small>(درمورد نقاط قوت محصول بنویسید)</small>'
            };
            titleElement.innerHTML = titles[rating] || '';
        } else {
            titleElement.style.display = 'none';
        }
    };

    const identityInput = commentForm?.querySelector('input[name="review_identity"]');
    const identityTrigger = modal?.querySelector('.hmyt-review-identity-trigger');
    const identityName = identityTrigger?.querySelector('.hmyt-review-identity-name');
    const identityMode = identityTrigger?.querySelector('.hmyt-review-identity-mode');
    const identityOptions = identityLayer?.querySelectorAll('[data-identity]') || [];
    const namedIdentityName = identityName?.textContent.trim() || '';
    const anonymousIdentityName = hamyar_comment_data?.anonymous?.label || 'کاربر ناشناس';

    const setIdentitySelection = (value = 'named') => {
        const selectedValue = value === 'anonymous' ? 'anonymous' : 'named';
        if (identityInput) identityInput.value = selectedValue;
        if (identityName) {
            identityName.textContent = selectedValue === 'anonymous' ? anonymousIdentityName : namedIdentityName;
        }
        if (identityMode) {
            identityMode.textContent = selectedValue === 'anonymous' ? 'ارسال ناشناس' : 'ارسال با نام شما';
        }
        identityOptions.forEach(option => {
            const isSelected = option.dataset.identity === selectedValue;
            option.classList.toggle('is-selected', isSelected);
            option.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        });
    };

    const closeIdentityDialog = () => {
        if (!identityLayer || identityLayer.hidden) return;
        identityLayer.hidden = true;
        identityLayer.setAttribute('aria-hidden', 'true');
        identityTrigger?.setAttribute('aria-expanded', 'false');
        identityTrigger?.focus();
    };

    const openIdentityDialog = () => {
        if (!identityLayer || !identityTrigger) return;
        identityLayer.hidden = false;
        identityLayer.setAttribute('aria-hidden', 'false');
        identityTrigger.setAttribute('aria-expanded', 'true');
        const selected = identityLayer.querySelector('.is-selected') || identityLayer.querySelector('[data-identity]');
        requestAnimationFrame(() => selected?.focus());
    };

    const resetIdentitySelection = () => setIdentitySelection('named');

    const mediaInput = commentForm?.querySelector('.hmyt-review-file-input');
    const mediaList = modal?.querySelector('.hmyt-review-media-list');
    const mediaAddButton = modal?.querySelector('.hmyt-review-add-media');
    const configuredMaxImages = Number(hamyar_comment_data?.media?.max_count || mediaList?.closest('.hmyt-review-media-picker')?.dataset.maxCount || 0);
    const configuredMaxBytes = Number(hamyar_comment_data?.media?.max_size_bytes || 0);
    const allowedImageTypes = Array.isArray(hamyar_comment_data?.media?.allowed_types)
        ? hamyar_comment_data.media.allowed_types
        : ['image/jpeg', 'image/png', 'image/webp'];

    const syncMediaInput = () => {
        if (!mediaInput || typeof DataTransfer === 'undefined') return;
        const transfer = new DataTransfer();
        selectedReviewFiles.forEach(file => transfer.items.add(file));
        mediaInput.files = transfer.files;
    };

    const renderMediaPreviews = () => {
        if (!mediaList) return;
        mediaList.querySelectorAll('.hmyt-review-media-item').forEach(item => item.remove());
        revokePreviewUrls();

        selectedReviewFiles.forEach((file, index) => {
            const objectUrl = URL.createObjectURL(file);
            previewObjectUrls.push(objectUrl);

            const item = document.createElement('div');
            item.className = 'hmyt-review-media-item';
            item.setAttribute('role', 'listitem');

            const image = document.createElement('img');
            image.src = objectUrl;
            image.alt = `پیش‌نمایش تصویر ${toPersianNum(index + 1)}`;

            const remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'hmyt-review-remove-media';
            remove.dataset.removeMedia = String(index);
            remove.setAttribute('aria-label', `حذف تصویر ${toPersianNum(index + 1)}`);
            remove.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="color: currentColor"> <path d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M10.33 16.5H13.66" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M9.5 12.5H14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>';

            item.append(image, remove);
            mediaList.insertBefore(item, mediaAddButton);
        });

        if (mediaAddButton) mediaAddButton.hidden = configuredMaxImages > 0 && selectedReviewFiles.length >= configuredMaxImages;
        syncMediaInput();
    };

    const addSelectedMedia = (files) => {
        const incoming = Array.from(files || []);
        if (!incoming.length) return;

        for (const file of incoming) {
            if (configuredMaxImages > 0 && selectedReviewFiles.length >= configuredMaxImages) {
                toast.error(`حداکثر ${toPersianNum(configuredMaxImages)} تصویر می‌توانید پیوست کنید.`);
                break;
            }
            if (!allowedImageTypes.includes(file.type)) {
                toast.error('فقط تصاویر JPG، PNG و WebP قابل انتخاب هستند.');
                continue;
            }
            if (configuredMaxBytes > 0 && file.size > configuredMaxBytes) {
                const maxMb = Math.max(1, Math.round(configuredMaxBytes / 1048576));
                toast.error(`حجم هر تصویر باید کمتر از ${toPersianNum(maxMb)} مگابایت باشد.`);
                continue;
            }
            const duplicate = selectedReviewFiles.some(selected => (
                selected.name === file.name && selected.size === file.size && selected.lastModified === file.lastModified
            ));
            if (!duplicate) selectedReviewFiles.push(file);
        }

        renderMediaPreviews();
    };

    if (modal) {
        const ratingOptions = modal.querySelectorAll('.product-rate-modal-option');
        const ratingInput = commentForm.querySelector('input[name="rating"]');

        const selectRating = (value) => {
                syncRatingControls(value);
                updateCommentTitle(value);
                syncModalFooter();
                updateSubmitState();
        };

        ratingOptions.forEach(option => {
            option.setAttribute('role', 'radio');
            option.setAttribute('tabindex', '0');
            option.setAttribute('aria-checked', 'false');
            option.addEventListener('click', () => selectRating(option.dataset.value));
            option.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    selectRating(option.dataset.value);
                } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
                    event.preventDefault();
                    const options = Array.from(ratingOptions);
                    const currentIndex = options.indexOf(option);
                    const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
                    const nextOption = options[(currentIndex + direction + options.length) % options.length];
                    selectRating(nextOption.dataset.value);
                    nextOption.focus();
                }
            });
        });

        reviewRatingButtons.forEach(button => {
            button.addEventListener('click', () => selectRating(button.dataset.reviewRatingValue));
            button.addEventListener('mouseenter', () => {
                const hoveredRating = Number(button.dataset.reviewRatingValue);
                reviewRatingStars?.classList.add('is-previewing');
                reviewRatingButtons.forEach(item => {
                    item.classList.toggle('is-preview', Number(item.dataset.reviewRatingValue) <= hoveredRating);
                });
            });
        });

        reviewRatingStars?.addEventListener('mouseleave', () => {
            reviewRatingStars.classList.remove('is-previewing');
            reviewRatingButtons.forEach(button => button.classList.remove('is-preview'));
        });

        reviewTextarea?.addEventListener('input', updateSubmitState);

        reviewNextButton?.addEventListener('click', () => {
            const selectedRating = Number(ratingInput?.value || 0);
            if (selectedRating < 1) return;

            setComposerStep(2);
            requestAnimationFrame(() => reviewTextarea?.focus());
        });

        identityTrigger?.addEventListener('click', openIdentityDialog);
        identityLayer?.querySelector('.hmyt-review-identity-close')?.addEventListener('click', closeIdentityDialog);
        identityLayer?.querySelector('.hmyt-review-identity-backdrop')?.addEventListener('click', closeIdentityDialog);
        identityOptions.forEach(option => {
            option.addEventListener('click', () => {
                setIdentitySelection(option.dataset.identity);
                closeIdentityDialog();
            });
        });

        mediaAddButton?.addEventListener('click', () => mediaInput?.click());
        mediaInput?.addEventListener('change', event => {
            addSelectedMedia(event.target.files);
            event.target.value = '';
            syncMediaInput();
        });
        mediaList?.addEventListener('click', event => {
            const removeButton = event.target.closest('[data-remove-media]');
            if (!removeButton) return;
            const removeIndex = Number(removeButton.dataset.removeMedia);
            if (Number.isInteger(removeIndex) && selectedReviewFiles[removeIndex]) {
                selectedReviewFiles.splice(removeIndex, 1);
                renderMediaPreviews();
            }
        });
    }

    const handleFormSubmit = (form, parentId = 0) => {
        if (typeof hamyar_comment_data !== 'undefined' && hamyar_comment_data.is_demo === '1') {
            toast.error('ثبت دیدگاه در نسخه نمایشی غیرفعال است.');
            return;
        }

        if (parentId === 0 && form === commentForm && isRatingRequired()) {
            const selectedRating = Number(form.querySelector('input[name="rating"]')?.value || 0);
            if (selectedRating < 1) {
                setComposerStep(1);
                toast.error('لطفاً ابتدا امتیاز خود را انتخاب کنید.');
                modal?.querySelector('.product-rate-modal-option')?.focus();
                return;
            }
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
		if (form === commentForm && selectedReviewFiles.length === 0) {
			formData.delete('images[]');
			formData.delete('images');
			formData.delete('hmyt_comment_images');
		}
        const contentValue = formData.get('content');
        const content = typeof contentValue === 'string' ? contentValue.trim() : '';

        if (content.length < 5) {
            toast.error('دیدگاه شما باید حداقل شامل ۵ کاراکتر باشد.');
            submitBtn.disabled = false;
            return;
        }
        form.dataset.submitting = '1';
        submitBtn.disabled = true;
        formData.set('product_id', productId);
        formData.set('parent_id', parentId);
        formData.set('rating', formData.get('rating') || 0);
        formData.set('is_private', ['true', '1', 'on'].includes(String(formData.get('is_private'))) ? '1' : '0');

        fetch(`${hamyar_comment_data.rest_url}reviews/submit`, {
            method: 'POST',
            headers: { 'X-WP-Nonce': hamyar_comment_data.nonce },
            body: formData,
        })
        .then(res => res.json().then(body => ({ ok: res.ok, status: res.status, body })))
        .then(({ ok, status, body }) => {
            if (ok) {
                if (parentId === 0 && window.HMYTCommentMedia?.invalidate) {
                    window.HMYTCommentMedia.invalidate(productId);
                }
                form.reset();
                if (parentId > 0) {
                    form.closest('.reply-form-wrapper').remove();
                } else {
                    closeModal();
                }
                
                const noComments = commentList.querySelector('.no-comments');
                if (noComments) noComments.remove();

                const newCommentHtml = body.html;

                if (parentId > 0) {
                    const parentCommentElement = document.getElementById(`comment-${parentId}`);
                    if (parentCommentElement) {
                        const parentWrapper = parentCommentElement.closest('.hmyt-comment-wrapper');
                        if (parentWrapper) {
                            parentWrapper.insertAdjacentHTML('beforeend', newCommentHtml);
							prepareSmartExcerpts(parentWrapper);
                        }
                    }

                    const newReplyElement = document.getElementById(`comment-${body.comment.id}`);
                    if(newReplyElement) newReplyElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                } else {
                    if (Number(body.comment?.rating || formData.get('rating') || 0) > 0) {
                        updateRatingAbility({ can_rate: false });
                    }
                    const newCommentWrapper = document.createElement('div');
                    newCommentWrapper.className = 'hmyt-comment-wrapper hmyt-u-flex hmyt-u-flex-c';
                    newCommentWrapper.id = `hmyt-comment-wrapper-${body.comment.id}`;
                    newCommentWrapper.innerHTML = newCommentHtml;

                    commentList.prepend(newCommentWrapper);
					prepareSmartExcerpts(newCommentWrapper);
                    newCommentWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

            } else {
                toast.error(body.message || 'مشکلی در ارسال دیدگاه پیش آمد.');
            }
        })
        .catch(err => {
            console.error('Submit Error:', err);
            toast.error('ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.');
        })
        .finally(() => {
            form.dataset.submitting = '0';
            if (form === commentForm) {
                updateSubmitState();
            } else {
                submitBtn.disabled = false;
            }
        });
    };
    
    const openBuyerMedia = mediaButton => {
        if (!mediaButton || mediaButton.classList.contains('is-loading')) return;
        const mediaId = mediaButton.dataset.mediaId;
        mediaButton.classList.add('is-loading');

        fetchBuyerMediaGroups(productId)
            .then(groups => {
                const integrated = window.HMYTProductGallery
                    && typeof window.HMYTProductGallery.openBuyerMedia === 'function'
                    && window.HMYTProductGallery.openBuyerMedia(Number(productId), groups, Number(mediaId), mediaButton);
                if (integrated) return;

                const opensAllMedia = mediaButton.classList.contains('hmyt-buyer-media-strip__view-all');
                const activeGroup = groups.find(group => Array.isArray(group.media)
                    && group.media.some(item => String(item.id) === String(mediaId)));
                const fallbackMedia = opensAllMedia
                    ? groups.flatMap(group => Array.isArray(group.media) ? group.media : [])
                    : (activeGroup ? activeGroup.media : []);
                const fallbackItems = fallbackMedia
                    .map(item => ({
                        id: item.id,
                        url: item.full?.url || item.medium?.url || '',
                        alt: item.alt || ''
                    })).filter(item => item.url);
                getFallbackLightbox().open(fallbackItems, mediaId, mediaButton);
            })
            .catch(() => {
                const scope = mediaButton.closest('.hmyt-comment-media, .hmyt-buyer-media-strip');
                const buttons = Array.from(scope?.querySelectorAll('.hmyt-comment-media-thumb') || []);
                getFallbackLightbox().open(buttons.map(button => ({
                    id: button.dataset.mediaId,
                    url: button.dataset.mediaFull,
                    alt: button.dataset.mediaAlt || ''
                })).filter(item => item.url), mediaId, mediaButton);
            })
            .finally(() => mediaButton.classList.remove('is-loading'));
    };

    const initBuyerMediaStrip = () => {
        const strips = Array.from(app.querySelectorAll('.hmyt-buyer-media-strip'));
        if (!strips.length || !isProduct || hamyar_comment_data?.media?.show_strip !== '1') return;

        fetchBuyerMediaGroups(productId)
            .then(groups => {
                const items = groups.flatMap(group => (group.media || []).map(media => ({ group, media })))
                    .filter(entry => entry.media?.full?.url || entry.media?.medium?.url);
                if (!items.length) return;

                strips.forEach(strip => {
                    const rail = strip.querySelector('.hmyt-buyer-media-strip__rail');
                    if (!rail) return;
                    if (!rail.children.length) {
						items.slice(0, 6).forEach((entry, index) => {
							const media = entry.media;
							const button = document.createElement('button');
							button.type = 'button';
							button.className = 'hmyt-comment-media-thumb hmyt-buyer-media-strip__thumb';
							button.dataset.mediaId = String(media.id || '');
							button.dataset.mediaFull = media.full?.url || media.medium?.url || '';
							button.dataset.mediaAlt = media.alt || '';
							button.setAttribute('role', 'listitem');
							button.setAttribute('aria-label', `مشاهده تصویر ${toPersianNum(index + 1)} از تصاویر خریداران`);

							const image = document.createElement('img');
							image.src = media.thumbnail?.url || media.medium?.url || media.full?.url || '';
							image.alt = media.alt || '';
							image.loading = 'lazy';
							image.decoding = 'async';
							button.appendChild(image);

							rail.appendChild(button);
						});

						if (items.length > 6) {
							const firstMedia = items[0].media;
							const nextMedia = items[6].media;
							const viewAll = document.createElement('button');
							viewAll.type = 'button';
							viewAll.className = 'hmyt-buyer-media-strip__view-all';
							viewAll.dataset.mediaId = String(firstMedia.id || '');
							viewAll.dataset.mediaFull = firstMedia.full?.url || firstMedia.medium?.url || '';
							viewAll.dataset.mediaAlt = firstMedia.alt || '';
							viewAll.setAttribute('role', 'listitem');
							viewAll.setAttribute('aria-label', `مشاهده همه ${toPersianNum(items.length)} تصویر خریداران`);

							const image = document.createElement('img');
							image.className = 'hmyt-buyer-media-strip__view-all-image';
							image.src = nextMedia.thumbnail?.url || nextMedia.medium?.url || nextMedia.full?.url || '';
							image.alt = '';
							image.loading = 'lazy';
							image.decoding = 'async';
							image.setAttribute('aria-hidden', 'true');
							viewAll.appendChild(image);
							viewAll.insertAdjacentHTML('beforeend', '<span aria-hidden="true">•••</span><strong>مشاهده همه</strong>');
							rail.appendChild(viewAll);
						}
                    }

                    strip.hidden = false;
                });
            })
            .catch(() => {});

        strips.forEach(strip => {
            strip.addEventListener('click', event => {
                const button = event.target.closest('.hmyt-comment-media-thumb, .hmyt-buyer-media-strip__view-all');
                if (!button) return;
                event.preventDefault();
                openBuyerMedia(button);
            });
        });
    };

    initBuyerMediaStrip();

    commentList.addEventListener('click', e => {
		const excerptButton = e.target.closest('.hmyt-comment-text-more');
		if (excerptButton) {
			e.preventDefault();
			const text = document.getElementById(excerptButton.getAttribute('aria-controls'));
			if (text) {
				text.classList.remove('is-smart-collapsed');
				text.dataset.smartExcerptExpanded = '1';
				text.setAttribute('tabindex', '-1');
				excerptButton.setAttribute('aria-expanded', 'true');
				excerptButton.remove();
				text.focus({ preventScroll: true });
			}
			return;
		}

        const mediaButton = e.target.closest('.hmyt-comment-media-thumb');
        if (mediaButton) {
            e.preventDefault();
            openBuyerMedia(mediaButton);
            return;
        }

        const pinBtn = e.target.closest('.pin-reply-btn');
        if (pinBtn) {
            e.preventDefault();
            if (pinBtn.classList.contains('loading')) return;
            
            const commentId = pinBtn.dataset.id;
            pinBtn.classList.add('loading');

            fetch(`${hamyar_comment_data.rest_url}reviews/pin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': hamyar_comment_data.nonce },
                body: JSON.stringify({ comment_id: commentId }),
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    toast.success(data.message);
                    fetchReviews(false); 
                } else {
                    toast.error(data.message || 'خطا در عملیات');
                }
            })
            .catch(err => {
                toast.error('خطای ارتباط با سرور');
            })
            .finally(() => {
                pinBtn.classList.remove('loading');
            });
            return;
        }

        const voteBtn = e.target.closest('.hmyt-vote-btn');
        if (voteBtn) {
            if (!isUserLoggedIn) {
                 const redirectEnabled = (typeof hamyar_comment_data !== 'undefined' && hamyar_comment_data.guest_redirect_enabled === '1');
                 if (redirectEnabled && loginUrl) {
                    toast.error('برای ثبت رای باید وارد شوید.');
                 } else {
                     toast.error('برای ثبت رای باید وارد شوید.');
                 }
                 return;
            }

            if (voteBtn.classList.contains('loading')) return;

            if (typeof hamyar_comment_data !== 'undefined' && hamyar_comment_data.is_demo === '1') {
                toast.error('ثبت امتیاز در نسخه نمایشی غیرفعال است.');
                return;
            }

            const container = voteBtn.closest('.hmyt-vote-container');
            const likeBtn = container.querySelector('.vote-like');
            const dislikeBtn = container.querySelector('.vote-dislike');
            const commentId = voteBtn.dataset.id;
            const type = voteBtn.dataset.type;

            voteBtn.classList.add('loading');

            fetch(`${hamyar_comment_data.rest_url}reviews/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': hamyar_comment_data.nonce },
                body: JSON.stringify({ comment_id: commentId, type: type }),
            })
            .then(res => {
                if(res.status === 429) throw new Error('تعداد درخواست بیش از حد مجاز');
                if(!res.ok) throw new Error('خطا در ارتباط');
                return res.json();
            })
            .then(data => {
                const likeSpan = likeBtn.querySelector('.vote-count');
                if (data.likes > 0) {
                    if (likeSpan) likeSpan.textContent = toPersianNum(data.likes);
                    else likeBtn.insertAdjacentHTML('beforeend', `<span class="vote-count">${toPersianNum(data.likes)}</span>`);
                } else {
                    if (likeSpan) likeSpan.remove();
                }

                const dislikeSpan = dislikeBtn.querySelector('.vote-count');
                if (data.dislikes > 0) {
                    if (dislikeSpan) dislikeSpan.textContent = toPersianNum(data.dislikes);
                    else dislikeBtn.insertAdjacentHTML('beforeend', `<span class="vote-count">${toPersianNum(data.dislikes)}</span>`);
                } else {
                    if (dislikeSpan) dislikeSpan.remove();
                }

                likeBtn.classList.remove('active');
                dislikeBtn.classList.remove('active');
                
                if (data.user_vote === 'like') likeBtn.classList.add('active');
                if (data.user_vote === 'dislike') dislikeBtn.classList.add('active');

				fetchBuyerMediaGroups(productId).then(groups => {
					const group = groups.find(item => String(item.comment_id) === String(commentId));
					if (group) {
						group.vote_stats = {
							likes: Number(data.likes || 0),
							dislikes: Number(data.dislikes || 0),
							user_vote: data.user_vote || ''
						};
					}
				}).catch(() => {});
            })
            .catch(err => {
                toast.error(err.message || 'خطایی رخ داد.');
            })
            .finally(() => {
                voteBtn.classList.remove('loading');
            });
            
            return;
        }

        const replyBtn = e.target.closest('.comment-reply-btn');
        if (replyBtn) {
            if (!isUserLoggedIn) {
                const redirectEnabled = (typeof hamyar_comment_data !== 'undefined' && hamyar_comment_data.guest_redirect_enabled === '1');
                
                if (redirectEnabled && loginUrl) {
                    toast.error('برای پاسخ به دیدگاه ابتدا باید وارد حساب کاربری خود شوید.');
                    setTimeout(() => {
                        toast.loading('در حال انتقال به صفحه ورود...');
                        setTimeout(() => {
                            window.location.href = loginUrl;
                        }, 1000);
                    }, 1500);
                } else {
                    toast.error('برای پاسخ به دیدگاه باید وارد شوید.');
                }
                return;
            }
            document.querySelector('.reply-form-wrapper')?.remove();

            const commentId = replyBtn.dataset.id;
            const authorName = replyBtn.dataset.name;
            const parentCommentContainer = document.getElementById(`comment-${commentId}`);
            const isParentPrivate = parentCommentContainer.dataset.isPrivate === 'true';
            
            const replyWrapper = document.createElement('div');
            replyWrapper.className = 'reply-form-wrapper';
            replyWrapper.innerHTML = document.getElementById('reply-form-template').innerHTML;
            
            parentCommentContainer.after(replyWrapper);

            if (isParentPrivate) {
                const privateCheckbox = replyWrapper.querySelector('input[name="is_private"]');
                if (privateCheckbox) {
                    privateCheckbox.checked = true;
                    privateCheckbox.disabled = true;
                }
            }
            
            replyWrapper.querySelector('.reply-to-name').textContent = authorName;
            replyWrapper.querySelector('.input_comment_parent_id').value = commentId;

            const form = replyWrapper.querySelector('form');
            form.addEventListener('submit', (ev) => {
                ev.preventDefault();
                handleFormSubmit(form, commentId);
            });

            form.querySelector('.comment-form-reply-cancel').addEventListener('click', () => replyWrapper.remove());
            
            replyWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const aiReplyBtn = e.target.closest('.ai-reply-btn');
        if (aiReplyBtn) {
            e.preventDefault();
            
            const commentId = aiReplyBtn.dataset.id;
            const wrapper = aiReplyBtn.closest('.hmyt-comment-wrapper') || aiReplyBtn.closest('.comment-container');
            const normalReplyBtn = wrapper.querySelector('.comment-reply-btn:not(.ai-reply-btn)');
            
            if (!document.querySelector(`.reply-form-wrapper input[value="${commentId}"]`)) {
                if(normalReplyBtn) normalReplyBtn.click();
            }

            setTimeout(() => {
                const replyFormWrapper = document.querySelector('.reply-form-wrapper');
                if (!replyFormWrapper) return;

                const textarea = replyFormWrapper.querySelector('textarea[name="content"]');
                const aiBtnIcon = aiReplyBtn.querySelector('svg');
                
                if (textarea) {
                    const originalPlaceholder = textarea.placeholder;
                    textarea.value = '';
                    textarea.disabled = true;
                    aiReplyBtn.classList.add('loading');

                    const baseLoadingText = "در حال فکر کردن";
                    let dotCount = 0;
                    textarea.placeholder = baseLoadingText;
                    
                    const loadingInterval = setInterval(() => {
                        dotCount = (dotCount + 1) % 4;
                        const dots = ".".repeat(dotCount);
                        textarea.placeholder = baseLoadingText + dots;
                    }, 500);

                    const params = new URLSearchParams();
                    params.append('action', 'hmyt_ai_generate_comment_response');
                    params.append('comment_id', commentId);
                    params.append('security', hamyar_comment_data.ai_nonce);

                    fetch(hamyar_comment_data.ajax_url, {
                        method: 'POST',
                        body: params,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            textarea.value = '';
                            textarea.disabled = false;
                            const successBadge = document.createElement('span');
                            successBadge.className = 'comment-reply-btn ai-done hmyt-u-flex';
                            successBadge.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                </svg>
                                پاسخ تولید شد
                            `;
                            
                            const btnContainer = aiReplyBtn.parentNode;
                            btnContainer.insertBefore(successBadge, aiReplyBtn.nextSibling);

                            setTimeout(() => {
                                successBadge.style.transition = 'all 0.5s ease';
                                successBadge.style.opacity = '0';
                                setTimeout(() => successBadge.remove(), 500);
                            }, 7000);
                            textarea.placeholder = originalPlaceholder;
                            textarea.focus();
                            
                            const responseText = data.data.response_text;
                            let i = 0;
                            const typeWriter = () => {
                                if (i < responseText.length) {
                                    textarea.value += responseText.charAt(i);
                                    textarea.scrollTop = textarea.scrollHeight;
                                    i++;
                                    setTimeout(typeWriter, 10);
                                }
                            };
                            typeWriter();

                        } else {
                            toast.error(data.data.message || 'خطا در تولید پاسخ');
                            textarea.disabled = false;
                            textarea.placeholder = originalPlaceholder;
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        toast.error('خطای ارتباط با سرور');
                        textarea.disabled = false;
                        textarea.placeholder = originalPlaceholder;
                    })
                    .finally(() => {
                        clearInterval(loadingInterval);
                        aiReplyBtn.classList.remove('loading');
                    });
                }
            }, 100);
        }

        const replyToLink = e.target.closest('.comment-reply-to');
        if (replyToLink) {
            e.preventDefault();
            const currentCommentContainer = replyToLink.closest('.comment-container');
            const parentId = currentCommentContainer.dataset.parentId;

            if (parentId && parentId !== '0') {
                const parentComment = document.getElementById(`comment-${parentId}`);
                if (parentComment) {
                    document.querySelectorAll('.comment-focus').forEach(el => el.classList.remove('comment-focus'));

                    parentComment.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    parentComment.classList.add('comment-focus');

                    setTimeout(() => {
                        parentComment.classList.remove('comment-focus');
                    }, 1500);
                }
            }
        }
        
    });
    
    if(showFormBtn) {
        showFormBtn.addEventListener('click', handleNewCommentClick);
    }

	if (smartExcerptEnabled) {
		prepareSmartExcerpts(commentList);
		if ('ResizeObserver' in window) {
			let observedWidth = 0;
			const excerptObserver = new ResizeObserver(entries => {
				const nextWidth = entries[0]?.contentRect?.width || 0;
				if (nextWidth < 1 || Math.abs(nextWidth - observedWidth) < 1) return;
				observedWidth = nextWidth;
				window.clearTimeout(smartExcerptResizeTimer);
				smartExcerptResizeTimer = window.setTimeout(() => prepareSmartExcerpts(commentList, true), 60);
			});
			excerptObserver.observe(commentList);
		} else {
			window.addEventListener('resize', () => {
				window.clearTimeout(smartExcerptResizeTimer);
				smartExcerptResizeTimer = window.setTimeout(() => prepareSmartExcerpts(commentList, true), 120);
			}, { passive: true });
		}
		document.fonts?.ready?.then(() => prepareSmartExcerpts(commentList, true));
	}
    
    if (modal) {
        modalCloseButton?.addEventListener('click', () => {
            if (isRatingRequired() && commentForm?.dataset.composerStep === '2') {
                setComposerStep(1);
                requestAnimationFrame(() => {
                    const selectedRating = modal.querySelector('.product-rate-modal-option[aria-checked="true"]');
                    (selectedRating || modal.querySelector('.product-rate-modal-option'))?.focus();
                });
                return;
            }
            closeModal();
        });
        modal.querySelector('.product-rate-modal-bg')?.addEventListener('click', closeModal);
        
        modal.querySelector('.product-rate-modal-container').addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });

        commentForm.addEventListener('submit', e => {
            e.preventDefault();
            handleFormSubmit(commentForm);
        });

        document.addEventListener('keydown', event => {
            if (modal.getAttribute('aria-hidden') !== 'false') return;

            if (event.key === 'Escape') {
                event.preventDefault();
                if (identityLayer && !identityLayer.hidden) {
                    closeIdentityDialog();
                } else {
                    closeModal();
                }
                return;
            }

            if (event.key !== 'Tab') return;
            const focusScope = identityLayer && !identityLayer.hidden ? identityLayer : commentForm;
            const focusable = Array.from(focusScope.querySelectorAll(
                'button:not([disabled]):not([hidden]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )).filter(element => element.offsetParent !== null && element.tabIndex >= 0);
            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            state.currentFilter = button.dataset.filter;
            state.currentSort = button.dataset.sort ? button.dataset.sort : 'newest';
            
            state.currentPage = 1;
            fetchReviews(true);
        });
    });

    
    const loadNextPage = () => {
        if(state.currentPage < state.totalPages && !state.isLoading) {
            state.currentPage++;
            fetchReviews();
        }
    };

    if (hamyar_comment_data.infinite_scroll_enabled === '1') {
        loadMoreBtn.style.display = 'none';
        
        const scrollObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadNextPage();
            }
        }, {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        });

        scrollObserver.observe(loadMoreContainer);
    } else {
        loadMoreBtn.addEventListener('click', loadNextPage);
    }
    
    if (floatingBtn) {
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0
        };

        let cmFloatingState = {
            inView: false,
            locked: false,
            originalDesktopV: null,
            originalMobileV: null
        };

        const readOriginalSpacing = () => {
            if (cmFloatingState.originalDesktopV !== null) return;
            const rootStyle = getComputedStyle(document.documentElement);
            const dv = rootStyle.getPropertyValue('--hmyt-cm-fab-desktop-v').trim();
            const mv = rootStyle.getPropertyValue('--hmyt-cm-fab-mobile-v').trim();
            cmFloatingState.originalDesktopV = parseInt(dv) || 30;
            cmFloatingState.originalMobileV = parseInt(mv) || 20;
        };

        const applyBottomOffset = (offset) => {
            readOriginalSpacing();
            const newDesktopV = cmFloatingState.originalDesktopV + offset;
            const newMobileV = cmFloatingState.originalMobileV + offset;
            document.documentElement.style.setProperty('--hmyt-cm-fab-desktop-v', newDesktopV + 'px');
            document.documentElement.style.setProperty('--hmyt-cm-fab-mobile-v', newMobileV + 'px');
        };

        const resetBottomOffset = () => {
            if (cmFloatingState.originalDesktopV === null) return;
            document.documentElement.style.setProperty('--hmyt-cm-fab-desktop-v', cmFloatingState.originalDesktopV + 'px');
            document.documentElement.style.setProperty('--hmyt-cm-fab-mobile-v', cmFloatingState.originalMobileV + 'px');
        };

        const applyLayoutOffset = () => {
            if (cmFloatingState.locked) return;
            if (!window.HmytLayout) return;
            const offset = window.HmytLayout.getBottomOffset();
            if (offset > 0) {
                applyBottomOffset(offset);
            } else {
                resetBottomOffset();
            }
        };

        const updateVisibility = () => {
            if (cmFloatingState.locked) {
                floatingBtn.classList.add('hide');
            } else if (cmFloatingState.inView) {
                floatingBtn.classList.remove('hide');
            } else {
                floatingBtn.classList.add('hide');
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                cmFloatingState.inView = entry.isIntersecting;
                updateVisibility();
            });
        }, observerOptions);

        observer.observe(app);

        floatingBtn.addEventListener('click', handleNewCommentClick);

        if (window.HmytLayout) {
            window.HmytLayout.onChange(applyLayoutOffset);
            setTimeout(applyLayoutOffset, 100);
        }

        window.addEventListener('hmyt:floating:lock', () => {
            cmFloatingState.locked = true;
            updateVisibility();
        });
        window.addEventListener('hmyt:floating:unlock', () => {
            cmFloatingState.locked = false;
            updateVisibility();
        });

        window.addEventListener('hmyt:dk:modal-open', resetBottomOffset);
        window.addEventListener('hmyt:dk:modal-close', applyLayoutOffset);
    }

    if (rateTip) {
        rateTip.addEventListener('click', (e) => {
            if (e.target.id !== 'product-rate-tip-close' && !e.target.closest('#product-rate-tip-close')) {
                openModal();
            }
        });
    }

    if (rateTipClose) {
        rateTipClose.addEventListener('click', (e) => {
            e.stopPropagation();
            if (rateTip) {
                rateTip.classList.add('hide');
            }
        });
    }

    const hydrateFromSSR = () => {
        state.currentPage = 1;
        state.totalPages = parseInt(app.dataset.totalPages, 10) || 1;

        const aiWrapper = document.getElementById('ai-summary-wrapper');
        if (aiWrapper) aiWrapper.style.display = 'block';

        updateRatingAbility({ can_rate: commentForm?.dataset.ratingRequired === '1' });

        if (state.currentPage < state.totalPages) {
            loadMoreContainer.style.display = 'block';
        } else {
            loadMoreContainer.style.display = 'none';
        }
    };

    const ssrActive = app.dataset.ssr === '1' && commentList.children.length > 0;

    if (ssrActive) {
        hydrateFromSSR();
    } else {
        fetchReviews();
    }

    if (app.classList.contains('hmyt-tpl-digikala') && window.matchMedia('(max-width: 768px)').matches) {
        const sheetHashes = {
            comments: '#hmyt-comment',
            ai: '#hmyt-review-summary'
        };
        const sheetHashPushed = {
            comments: false,
            ai: false
        };
        const getSheet = (n) => document.getElementById('hmyt-dk-' + n + '-sheet');
        const getSheetName = (s) => {
            const match = s && s.id ? s.id.match(/^hmyt-dk-(.+)-sheet$/) : null;
            return match ? match[1] : '';
        };
        const sheets = ['comments', 'ai', 'sort'].map(getSheet).filter(Boolean);
        const productTabsReviewSection = app.closest('.hmyt-pdtabs-section--reviews');
        const openTriggerScope = productTabsReviewSection || app;
        const openTriggers = Array.from(openTriggerScope.querySelectorAll('[data-hmyt-open]'));
        const closeTriggers = sheets.reduce((triggers, sheet) => {
            return triggers.concat(Array.from(sheet.querySelectorAll('[data-hmyt-close]')));
        }, []);

        /*
         * Product tabs (and some themes) create an isolated stacking context.
         * Keep mobile sheets as direct body children so their fixed positioning
         * and z-index can always cover sticky headers, footers and product cards.
         */
        sheets.forEach(sheet => {
            sheet.classList.add('hmyt-tpl-digikala', 'hmyt-dk-portal');
            if (sheet.parentElement !== document.body) {
                document.body.appendChild(sheet);
            }
        });

        const sheetOpen = (n) => { const s = getSheet(n); return s && s.classList.contains('open'); };
        const anyOpen = () => !!document.querySelector('.hmyt-dk-sheet.open');
        const fabShouldShow = () => sheetOpen('comments') && !sheetOpen('sort') && !sheetOpen('ai');
        const syncFab = () => {
            if (!floatingBtn) return;
            if (fabShouldShow()) {
                document.body.classList.add('hmyt-dk-comments-open');
                floatingBtn.classList.remove('hide');
            } else {
                document.body.classList.remove('hmyt-dk-comments-open');
            }
            window.dispatchEvent(new Event(sheetOpen('comments') ? 'hmyt:dk:modal-open' : 'hmyt:dk:modal-close'));
        };

        const pushSheetHash = (n) => {
            const hash = sheetHashes[n];
            if (!hash || window.location.hash === hash) return;
            window.history.pushState({ hmytDkSheet: n }, '', hash);
            sheetHashPushed[n] = true;
        };

        const openSheet = (n) => {
            const s = getSheet(n);
            if (s) {
                s.classList.add('open');
                document.body.classList.add('hmyt-dk-lock');
                pushSheetHash(n);
                syncFab();
            }
        };
        const closeSheet = (s) => {
            const sheetName = getSheetName(s);
            const hash = sheetHashes[sheetName];
            if (hash && sheetHashPushed[sheetName] && window.location.hash === hash) {
                window.history.back();
                return;
            }
            if (s) s.classList.remove('open');
            if (!anyOpen()) document.body.classList.remove('hmyt-dk-lock');
            if (sheetName in sheetHashPushed) sheetHashPushed[sheetName] = false;
            syncFab();
        };

        window.addEventListener('popstate', () => {
            Object.keys(sheetHashes).forEach(n => {
                if (sheetOpen(n) && window.location.hash !== sheetHashes[n]) {
                    const sheet = getSheet(n);
                    if (sheet) sheet.classList.remove('open');
                    sheetHashPushed[n] = false;
                }
            });

            if (!sheetOpen('comments') && sheetOpen('sort')) {
                getSheet('sort').classList.remove('open');
            }

            if (!anyOpen()) document.body.classList.remove('hmyt-dk-lock');
            syncFab();
        });

        const aiWrap = document.getElementById('ai-summary-wrapper');
        const aiSlot = document.getElementById('hmyt-dk-ai-slot');
        if (aiWrap && aiSlot) { aiWrap.style.display = 'block'; aiSlot.appendChild(aiWrap); }

        app.addEventListener('hmyt:open-ai-summary', (event) => {
            const aiSheet = getSheet('ai');
            const populatedAiSlot = aiSheet && aiSheet.querySelector('#hmyt-dk-ai-slot');
            if (!populatedAiSlot || !populatedAiSlot.children.length) return;

            event.preventDefault();
            openSheet('ai');
        });

        const mainCol = app.querySelector('.hmyt-dk-main');
        const realFilters = Array.from((mainCol || app).querySelectorAll('.hmyt-dk-sort-list .filter-btn'));
        const commentsSlot = document.getElementById('hmyt-dk-comments-slot');
        if (mainCol && commentsSlot) {
			commentsSlot.appendChild(mainCol);
			prepareSmartExcerpts(commentList, true);
		}

        openTriggers.forEach(el => {
            el.addEventListener('click', (e) => { e.preventDefault(); openSheet(el.getAttribute('data-hmyt-open')); });
        });
        closeTriggers.forEach(el => {
            el.addEventListener('click', () => closeSheet(el.closest('.hmyt-dk-sheet')));
        });

        const sortOptions = document.getElementById('hmyt-dk-sort-options');
        if (sortOptions && realFilters.length) {
            const checkSvg = '<svg class="hmyt-dk-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            realFilters.forEach(btn => {
                const opt = document.createElement('div');
                opt.className = 'hmyt-dk-sort-option' + (btn.classList.contains('active') ? ' active' : '');
                const lbl = document.createElement('span');
                lbl.textContent = btn.textContent.trim();
                opt.appendChild(lbl);
                opt.insertAdjacentHTML('beforeend', checkSvg);
                opt.addEventListener('click', () => {
                    btn.click();
                    sortOptions.querySelectorAll('.hmyt-dk-sort-option').forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');
                    closeSheet(getSheet('sort'));
                });
                sortOptions.appendChild(opt);
            });
        }

        const writeCta = document.getElementById('hmyt-dk-write-cta');
        if (writeCta) writeCta.addEventListener('click', handleNewCommentClick);

        syncFab();
    }

    };

    const initWithin = (scope) => {
        const root = scope && scope.nodeType ? scope : document;
        if (root.matches && root.matches('#hamyar-comment-app')) {
            initCommentApp(root);
        }
        if (root.querySelectorAll) {
            root.querySelectorAll('#hamyar-comment-app').forEach(initCommentApp);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initWithin(document));
    } else {
        initWithin(document);
    }

    window.addEventListener('elementor/frontend/init', () => {
        if (!window.elementorFrontend || !elementorFrontend.hooks) return;
        elementorFrontend.hooks.addAction('frontend/element_ready/hmyt-product-tabs.default', ($scope) => {
            initWithin($scope && $scope[0] ? $scope[0] : document);
        });
    });
})();
