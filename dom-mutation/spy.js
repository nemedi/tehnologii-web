function spyOn(targetNode, tagName, callback) {
	const observer = new MutationObserver(mutations => {
		for (const mutation of mutations) {
			if (mutation.type === 'childList'
				&& mutation.addedNodes.length > 0) {
				mutation.addedNodes.forEach((node) => {
					if (node.tagName === tagName.toUpperCase()) {
						callback(node);
					}
				});
			}
		}
	});
	observer.observe(targetNode, {
	  childList: true,
	  subtree: true,
	});
}